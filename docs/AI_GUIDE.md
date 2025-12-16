# AI Agent Guide

Instructions for AI agents working on this codebase.

## Orientation

1. **Start here**: Read `/CLAUDE.md` for project overview and commands
2. **Understand the product**: Read `/docs/PRODUCT.md` to know what you're building
3. **Check past decisions**: Read `/docs/DECISIONS.md` before making architectural choices
4. **Review schema**: Read `/docs/SCHEMA.md` to understand the data model
5. **Learn from mistakes**: Check `/docs/PITFALLS.md` for known issues

## Common Tasks

### Adding a new field to an entity

1. Update schema in `/src/db/schema.ts`
2. Update Zod validation in `/src/lib/validations.ts`
3. Run `npm run db:push` to sync schema
4. Update relevant components and server actions
5. Document in `/docs/SCHEMA.md`

### Adding a new page

1. Create route in `/src/app/(protected)/` for auth-required pages
2. Create route in `/src/app/` for public pages
3. Use server components by default
4. Add 'use client' only for interactive components

### Modifying the design

1. Global styles are in `/src/app/globals.css`
2. Color variables are CSS custom properties
3. Tailwind classes for most styling
4. Keep cyberpunk aesthetic: dark bg, neon accents, glow effects

### Adding server actions

1. Create in `/src/actions/[entity].ts`
2. Validate input with Zod
3. Check auth with `getServerSession`
4. Use `revalidatePath()` after mutations
5. Return typed responses

## Patterns in Use

### Server Components for Data Fetching
```tsx
// In page.tsx (server component)
export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  const products = await getProductsByUser(session.user.id);
  return <ProductList products={products} />;
}
```

### Client Components for Interactivity
```tsx
'use client';
// In components/products/ProductForm.tsx
export function ProductForm({ onSubmit }) {
  const [pending, startTransition] = useTransition();
  // ... form handling
}
```

### Server Actions for Mutations
```tsx
// In actions/products.ts
'use server';
export async function createProduct(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  const validated = productSchema.parse({...});
  await db.insert(products).values(validated);
  revalidatePath('/products');
}
```

## Things to Watch Out For

1. **Always check auth in server actions** - Don't trust the client
2. **Validate all input with Zod** - Never trust user data
3. **Use revalidatePath after mutations** - Keep UI in sync
4. **Don't add API routes** - Use server actions instead
5. **Keep components flat** - Avoid deep nesting
6. **Document non-obvious decisions** - Add to DECISIONS.md

## When Making Changes

1. Before implementing, check if a similar pattern exists
2. Follow existing code style (Biome handles formatting)
3. Update docs if you change architecture or schema
4. Log pitfalls if something unexpected happens
5. Keep the cyberpunk aesthetic consistent

## Testing Your Changes

1. Run `npm run build` to check for type errors
2. Run `npm run lint` to check for code issues
3. Test auth flows (sign in, sign out, protected routes)
4. Test CRUD operations for both products and ideas
5. Check sorting and filtering work correctly
