---
title: "حل بازی 24 با الگوریتم‌ها: از پازل‌های ریاضی تا کد"
description: "کشف کنید چگونه پازل کلاسیک بازی 24 را با استفاده از تفکر الگوریتمی و جاوااسکریپت حل کنیم. شامل نمایش تعاملی و پیاده‌سازی کامل."
pubDate: 2024-12-28
author: "نوید جلیلیان"
tags: ["الگوریتم", "جاوااسکریپت", "ریاضی", "حل-مسئله", "برنامه-نویسی"]
heroImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&h=400&fit=crop"
featured: false
draft: false
lang: "fa"
postSlug: "solving-24-game-with-algorithms"
---

تازه شروع به خواندن یک کتاب ریاضی کرده بودم، بعد از همه چیزهایی که مدارس به ما تحمیل می‌کردند، تصمیم گرفتم فقط چیزهایی یاد بگیرم که از آن‌ها لذت می‌برم، پس کتاب _[Art of Problem Solving (AoPS) Prealgebra](https://www.amazon.com/Prealgebra-Richard-Rusczyk/dp/1934124214)_ را برداشتم. مصمم بودم هر تمرین را مثل یک بازی در نظر بگیرم نه یک کار اجباری، و در نتیجه در همان ساعت اول بسیار لذت بردم.

یکی از پازل‌های آن‌جا "بازی 24" بود: چهار عدد به شما داده می‌شود و باید با استفاده از عملیات حسابی عدد 24 را بسازید. کنجکاو شدم که چگونه می‌توانم این پازل‌ها را سریع‌تر حل کنم، پس شروع به کاوش کردم که الگوریتم‌ها چگونه می‌توانند کمک کنند و در این فرآیند، چیزهای زیادی یاد گرفتم.

یک رویکرد ساده و کامل، تست کردن همه ترکیبات ممکن عملیات روی اعداد داده شده است.

## پازل بازی 24

> **پازل.** چهار عدد مثبت داده شده (مثلاً 3، 4، 2، 8)، عملیات +، −، ×، ÷ و پرانتز را طوری قرار دهید که نتیجه دقیقاً 24 شود.  
> **مثال حل:** (8*(2-(3-4))) = 24

## رویکرد ساده Brute-Force

ساده‌ترین راه حل این است که همه حالات ممکن را امتحان کنیم:

1. **همه جایگشت‌های اعداد** (4! = 24 حالت)
2. **همه ترکیبات عملیات** (4³ = 64 حالت برای 3 عملیات)
3. **همه ساختارهای پرانتز** (5 ساختار مختلف)

```javascript
// تعریف عملیات‌ها
const operations = [
  { symbol: '+', func: (a, b) => a + b },
  { symbol: '-', func: (a, b) => a - b },
  { symbol: '*', func: (a, b) => a * b },
  { symbol: '/', func: (a, b) => b !== 0 ? a / b : null }
];

// تولید همه جایگشت‌های یک آرایه
function permutations(arr) {
  if (arr.length <= 1) return [arr];
  
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    const perms = permutations(rest);
    for (const perm of perms) {
      result.push([arr[i], ...perm]);
    }
  }
  return result;
}

// تولید همه ترکیبات عملیات
function operationCombinations() {
  const combinations = [];
  for (const op1 of operations) {
    for (const op2 of operations) {
      for (const op3 of operations) {
        combinations.push([op1, op2, op3]);
      }
    }
  }
  return combinations;
}
```

## ساختارهای مختلف پرانتز

برای چهار عدد، 5 ساختار مختلف پرانتز وجود دارد:

```javascript
// ساختارهای مختلف محاسبه
const structures = [
  // ((a op b) op c) op d
  (nums, ops) => {
    const step1 = ops[0].func(nums[0], nums[1]);
    if (step1 === null) return null;
    const step2 = ops[1].func(step1, nums[2]);
    if (step2 === null) return null;
    return ops[2].func(step2, nums[3]);
  },
  
  // (a op (b op c)) op d
  (nums, ops) => {
    const step1 = ops[1].func(nums[1], nums[2]);
    if (step1 === null) return null;
    const step2 = ops[0].func(nums[0], step1);
    if (step2 === null) return null;
    return ops[2].func(step2, nums[3]);
  },
  
  // (a op b) op (c op d)
  (nums, ops) => {
    const step1 = ops[0].func(nums[0], nums[1]);
    const step2 = ops[2].func(nums[2], nums[3]);
    if (step1 === null || step2 === null) return null;
    return ops[1].func(step1, step2);
  },
  
  // a op ((b op c) op d)
  (nums, ops) => {
    const step1 = ops[1].func(nums[1], nums[2]);
    if (step1 === null) return null;
    const step2 = ops[2].func(step1, nums[3]);
    if (step2 === null) return null;
    return ops[0].func(nums[0], step2);
  },
  
  // a op (b op (c op d))
  (nums, ops) => {
    const step1 = ops[2].func(nums[2], nums[3]);
    if (step1 === null) return null;
    const step2 = ops[1].func(nums[1], step1);
    if (step2 === null) return null;
    return ops[0].func(nums[0], step2);
  }
];
```

## الگوریتم کامل حل

```javascript
function solve24Game(numbers) {
  const target = 24;
  const epsilon = 1e-9; // برای مقایسه اعداد اعشاری
  const solutions = [];
  
  // همه جایگشت‌های اعداد
  const numberPerms = permutations(numbers);
  
  // همه ترکیبات عملیات
  const opCombinations = operationCombinations();
  
  for (const nums of numberPerms) {
    for (const ops of opCombinations) {
      for (let structureIndex = 0; structureIndex < structures.length; structureIndex++) {
        const result = structures[structureIndex](nums, ops);
        
        if (result !== null && Math.abs(result - target) < epsilon) {
          const solution = formatSolution(nums, ops, structureIndex);
          if (!solutions.includes(solution)) {
            solutions.push(solution);
          }
        }
      }
    }
  }
  
  return solutions;
}

// قالب‌بندی راه‌حل
function formatSolution(nums, ops, structureIndex) {
  const expressions = [
    `((${nums[0]} ${ops[0].symbol} ${nums[1]}) ${ops[1].symbol} ${nums[2]}) ${ops[2].symbol} ${nums[3]}`,
    `(${nums[0]} ${ops[0].symbol} (${nums[1]} ${ops[1].symbol} ${nums[2]})) ${ops[2].symbol} ${nums[3]}`,
    `(${nums[0]} ${ops[0].symbol} ${nums[1]}) ${ops[1].symbol} (${nums[2]} ${ops[2].symbol} ${nums[3]})`,
    `${nums[0]} ${ops[0].symbol} ((${nums[1]} ${ops[1].symbol} ${nums[2]}) ${ops[2].symbol} ${nums[3]})`,
    `${nums[0]} ${ops[0].symbol} (${nums[1]} ${ops[1].symbol} (${nums[2]} ${ops[2].symbol} ${nums[3]}))`
  ];
  
  return expressions[structureIndex];
}
```

## بهینه‌سازی و بهبودها

### 1. حذف تکرارها
```javascript
// استفاده از Set برای جلوگیری از راه‌حل‌های تکراری
const uniqueSolutions = new Set();

// نرمال‌سازی عبارات برای شناسایی تکرارها
function normalizeSolution(solution) {
  // حذف فضاهای اضافی و نرمال‌سازی
  return solution.replace(/\s+/g, ' ').trim();
}
```

### 2. Early Termination
```javascript
function solve24GameOptimized(numbers, findFirst = false) {
  // اگر فقط یک راه‌حل می‌خواهیم، بعد از پیدا کردن اولین راه‌حل متوقف شویم
  if (findFirst && solutions.length > 0) {
    return solutions;
  }
}
```

### 3. Memoization
```javascript
const memo = new Map();

function solve24WithMemo(numbers) {
  const key = numbers.slice().sort().join(',');
  if (memo.has(key)) {
    return memo.get(key);
  }
  
  const result = solve24Game(numbers);
  memo.set(key, result);
  return result;
}
```

## مثال عملی

```javascript
// تست الگوریتم
const testNumbers = [3, 4, 2, 8];
const solutions = solve24Game(testNumbers);

console.log(`راه‌حل‌های پیدا شده برای [${testNumbers.join(', ')}]:`);
solutions.forEach((solution, index) => {
  console.log(`${index + 1}. ${solution} = 24`);
});

// خروجی نمونه:
// 1. (8 * (2 - (3 - 4))) = 24
// 2. (8 * (2 + (4 - 3))) = 24
// 3. ((8 * 2) + (4 + 3)) = 24
```

## تحلیل پیچیدگی

- **پیچیدگی زمانی**: O(4! × 4³ × 5) = O(7,680) - ثابت برای 4 عدد
- **پیچیدگی مکانی**: O(1) برای محاسبات، O(n) برای ذخیره راه‌حل‌ها

## کاربردهای عملی

این الگوریتم نه تنها برای بازی 24 مفید است، بلکه مفاهیم آن در موارد زیر کاربرد دارد:

1. **Expression Evaluation**: ارزیابی عبارات ریاضی
2. **Compiler Design**: تجزیه و تحلیل عبارات
3. **Game AI**: حل پازل‌های منطقی
4. **Educational Tools**: ابزارهای آموزش ریاضی

## نتیجه‌گیری

حل بازی 24 با الگوریتم‌ها نشان می‌دهد که چگونه می‌توان مسائل ظاهراً ساده را به صورت سیستماتیک حل کرد. این رویکرد نه تنها راه‌حل‌های موجود را پیدا می‌کند، بلکه اطمینان می‌دهد که همه راه‌حل‌های ممکن کشف شوند.

کلید موفقیت در این نوع مسائل، تجزیه مسئله به اجزای کوچک‌تر و سپس ترکیب سیستماتیک آن‌هاست. این همان اصلی است که در بسیاری از الگوریتم‌های پیچیده‌تر نیز به کار می‌رود.
