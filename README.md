# Capacitor Alternate Icons - OutSystems

Capacitor plugin that allows changing an OutSystems Capacitor Mobile App's icon programmatically

## Install

```bash
npm install alternate-icons
npx cap sync
```

## API

<docgen-index>

* [`changeIcon(...)`](#changeicon)
* [`resetIcon(...)`](#reseticon)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### changeIcon(...)

```typescript
changeIcon(options: { alias: string; aliases: string[]; defaultAlias: string; cloneDefaultAlias: string; }) => Promise<void>
```

| Param         | Type                                                                                                |
| ------------- | --------------------------------------------------------------------------------------------------- |
| **`options`** | <code>{ alias: string; aliases: string[]; defaultAlias: string; cloneDefaultAlias: string; }</code> |

--------------------


### resetIcon(...)

```typescript
resetIcon(options: { aliases: string[]; defaultAlias: string; cloneDefaultAlias: string; }) => Promise<void>
```

| Param         | Type                                                                                 |
| ------------- | ------------------------------------------------------------------------------------ |
| **`options`** | <code>{ aliases: string[]; defaultAlias: string; cloneDefaultAlias: string; }</code> |

--------------------

</docgen-api>
