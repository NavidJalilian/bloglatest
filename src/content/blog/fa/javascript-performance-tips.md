---
title: "عملکرد پیشرفته جاوااسکریپت: از 60fps تا سرعت برق"
description: "تکنیک‌های بهینه‌سازی پیشرفته جاوااسکریپت که توسط شرکت‌های برتر برای دستیابی به زمان بارگذاری زیر 100 میلی‌ثانیه و انیمیشن‌های روان 60fps استفاده می‌شود را فرا بگیرید."
pubDate: 2025-06-28
author: "مارکوس رودریگز"
tags: ["جاوااسکریپت", "عملکرد", "بهینه-سازی", "web-vitals", "فرانت-اند"]
heroImage: ""
featured: false
draft: false
lang: "fa"
postSlug: "javascript-performance-tips"
---

# بهینه‌سازی عملکرد جاوااسکریپت: نکات و ترفندها

عملکرد برای اپلیکیشن‌های وب مدرن بسیار مهم است. کاربران انتظار رابط‌های سریع و پاسخگو دارند و موتورهای جستجو سایت‌های با عملکرد بالا را ترجیح می‌دهند. بیایید تکنیک‌های عملی بهینه‌سازی جاوااسکریپت را بررسی کنیم که می‌تواند عملکرد اپلیکیشن شما را به طور قابل توجهی بهبود بخشد.

## درک گلوگاه‌های عملکرد

قبل از بهینه‌سازی، شناسایی محل‌هایی که مشکلات عملکرد رخ می‌دهد ضروری است:

### مشکلات رایج عملکرد
- **اندازه بسته‌های بزرگ**: جاوااسکریپت زیادی برای دانلود و تجزیه
- **عملیات مسدودکننده**: عملیات همزمان که UI را منجمد می‌کنند
- **نشت حافظه**: حافظه آزاد نشده که باعث کندی می‌شود
- **الگوریتم‌های ناکارآمد**: پیچیدگی زمانی ضعیف در مسیرهای کد حیاتی
- **دستکاری مفرط DOM**: تغییرات مکرر layout

### اندازه‌گیری عملکرد
از ابزارهای توسعه‌دهنده مرورگر و API های عملکرد استفاده کنید:

```javascript
// اندازه‌گیری زمان اجرای تابع
function measurePerformance(fn, name) {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
  return result;
}

// استفاده
const result = measurePerformance(() => {
  // کد شما
  return heavyComputation();
}, 'Heavy Computation');
```

## تکنیک‌های بهینه‌سازی

### 1. کاهش اندازه بسته

#### Tree Shaking
```javascript
// بد: وارد کردن کل کتابخانه
import _ from 'lodash';

// خوب: وارد کردن تنها توابع مورد نیاز
import { debounce, throttle } from 'lodash';

// بهتر: استفاده از ES modules
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
```

#### Code Splitting
```javascript
// بارگذاری تنبل کامپوننت‌ها
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// بارگذاری شرطی ماژول‌ها
async function loadFeature() {
  if (shouldLoadFeature()) {
    const { feature } = await import('./feature');
    return feature;
  }
}
```

### 2. بهینه‌سازی حلقه‌ها

```javascript
// بد: دسترسی مکرر به خاصیت
for (let i = 0; i < array.length; i++) {
  // array.length در هر تکرار محاسبه می‌شود
}

// خوب: ذخیره طول آرایه
const length = array.length;
for (let i = 0; i < length; i++) {
  // بهتر
}

// بهترین: استفاده از for...of برای آرایه‌ها
for (const item of array) {
  // سریع‌ترین برای تکرار ساده
}
```

### 3. مدیریت حافظه

#### جلوگیری از نشت حافظه
```javascript
// بد: Event listener پاک نشده
function badExample() {
  const element = document.getElementById('button');
  element.addEventListener('click', handleClick);
  // هیچ cleanup نیست
}

// خوب: پاک کردن event listener
function goodExample() {
  const element = document.getElementById('button');
  const cleanup = () => {
    element.removeEventListener('click', handleClick);
  };
  
  element.addEventListener('click', handleClick);
  return cleanup;
}

// استفاده از WeakMap برای references
const weakMap = new WeakMap();
function associateData(obj, data) {
  weakMap.set(obj, data); // خودکار پاک می‌شود
}
```

### 4. بهینه‌سازی DOM

#### Batch DOM Updates
```javascript
// بد: تغییرات متعدد DOM
function badDOMUpdate(items) {
  const container = document.getElementById('container');
  items.forEach(item => {
    const div = document.createElement('div');
    div.textContent = item.text;
    container.appendChild(div); // هر بار reflow
  });
}

// خوب: استفاده از DocumentFragment
function goodDOMUpdate(items) {
  const container = document.getElementById('container');
  const fragment = document.createDocumentFragment();
  
  items.forEach(item => {
    const div = document.createElement('div');
    div.textContent = item.text;
    fragment.appendChild(div);
  });
  
  container.appendChild(fragment); // تنها یک reflow
}
```

#### Virtual Scrolling
```javascript
class VirtualList {
  constructor(container, items, itemHeight) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.visibleStart = 0;
    this.visibleEnd = 0;
    this.init();
  }
  
  init() {
    this.container.style.height = `${this.items.length * this.itemHeight}px`;
    this.container.addEventListener('scroll', this.onScroll.bind(this));
    this.render();
  }
  
  onScroll() {
    const scrollTop = this.container.scrollTop;
    this.visibleStart = Math.floor(scrollTop / this.itemHeight);
    this.visibleEnd = this.visibleStart + Math.ceil(this.container.clientHeight / this.itemHeight);
    this.render();
  }
  
  render() {
    // رندر تنها آیتم‌های قابل مشاهده
    const visibleItems = this.items.slice(this.visibleStart, this.visibleEnd);
    // ... منطق رندر
  }
}
```

### 5. Debouncing و Throttling

```javascript
// Debounce: تأخیر اجرا تا توقف فراخوانی‌ها
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Throttle: محدود کردن تعداد فراخوانی‌ها
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// استفاده
const debouncedSearch = debounce(searchFunction, 300);
const throttledScroll = throttle(scrollHandler, 100);

document.getElementById('search').addEventListener('input', debouncedSearch);
window.addEventListener('scroll', throttledScroll);
```

### 6. Web Workers

```javascript
// main.js
const worker = new Worker('worker.js');

worker.postMessage({ data: largeDataSet });

worker.onmessage = function(e) {
  const result = e.data;
  // استفاده از نتیجه
};

// worker.js
self.onmessage = function(e) {
  const { data } = e.data;
  
  // محاسبات سنگین
  const result = heavyComputation(data);
  
  self.postMessage(result);
};
```

### 7. Caching و Memoization

```javascript
// Simple memoization
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// استفاده
const expensiveFunction = memoize((n) => {
  // محاسبه پیچیده
  return fibonacci(n);
});

// LRU Cache برای مدیریت حافظه
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  
  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value); // به انتها منتقل کن
      return value;
    }
    return null;
  }
  
  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}
```

## ابزارهای اندازه‌گیری

### Performance Observer
```javascript
// اندازه‌گیری Core Web Vitals
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'largest-contentful-paint') {
      console.log('LCP:', entry.startTime);
    }
    if (entry.entryType === 'first-input') {
      console.log('FID:', entry.processingStart - entry.startTime);
    }
  }
});

observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
```

### Bundle Analysis
```bash
# تجزیه و تحلیل اندازه بسته
npm install --save-dev webpack-bundle-analyzer

# اجرا
npx webpack-bundle-analyzer dist/static/js/*.js
```

## نتیجه‌گیری

بهینه‌سازی عملکرد جاوااسکریپت فرآیندی مداوم است که نیاز به:

1. **اندازه‌گیری مداوم**: همیشه قبل از بهینه‌سازی اندازه‌گیری کنید
2. **بهینه‌سازی تدریجی**: تغییرات کوچک و قابل اندازه‌گیری
3. **تست در محیط واقعی**: عملکرد در دستگاه‌های مختلف
4. **نظارت مداوم**: استفاده از ابزارهای monitoring

با پیاده‌سازی این تکنیک‌ها، می‌توانید اپلیکیشن‌هایی بسازید که نه تنها سریع بارگذاری می‌شوند بلکه تجربه کاربری روان و لذت‌بخشی نیز ارائه می‌دهند.
