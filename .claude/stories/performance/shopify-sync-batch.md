# Story: Fix N+1 Shopify Sync

**Epic:** `epics/security-hardening.md`
**Status:** not-started
**Priority:** P1
**Created:** 2024-12-08

## Objective
Replace individual database queries in Shopify sync with batch operations.

## Problem
**File:** `services/shopify.ts:217-238`

Current implementation:
```typescript
for (const product of products) {
  const existing = await db.select()...  // 1 query per product
  if (existing) {
    await db.update()...                  // 1 query per product
  } else {
    await db.insert()...                  // 1 query per product
  }
}
```

With 500 products = 1000+ database queries per sync.

## Acceptance Criteria
- [ ] Fetch all existing products in single query
- [ ] Use batch upsert instead of individual insert/update
- [ ] Reduce sync time by 10x+
- [ ] Add progress logging for large syncs

## Implementation

```typescript
// services/shopify.ts
export async function syncProducts(shopifyProducts: ShopifyProduct[]) {
  // 1. Get all existing product IDs in ONE query
  const existingProducts = await db
    .select({ shopifyProductId: products.shopifyProductId })
    .from(products);

  const existingIds = new Set(existingProducts.map(p => p.shopifyProductId));

  // 2. Separate into inserts vs updates
  const toInsert = [];
  const toUpdate = [];

  for (const product of shopifyProducts) {
    const data = transformProduct(product);
    if (existingIds.has(product.id)) {
      toUpdate.push(data);
    } else {
      toInsert.push(data);
    }
  }

  // 3. Batch insert new products
  if (toInsert.length > 0) {
    await db.insert(products).values(toInsert);
  }

  // 4. Batch update existing (use transaction)
  if (toUpdate.length > 0) {
    await db.transaction(async (tx) => {
      for (const product of toUpdate) {
        await tx
          .update(products)
          .set(product)
          .where(eq(products.shopifyProductId, product.shopifyProductId));
      }
    });
  }

  console.log(`Synced ${toInsert.length} new, ${toUpdate.length} updated`);
}
```

## Test Plan
1. Time sync with 100 products before/after
2. Verify all products sync correctly
3. Check no duplicate entries created
