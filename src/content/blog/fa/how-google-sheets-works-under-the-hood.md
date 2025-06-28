---
title: "چگونه Google Sheets در پشت صحنه کار می‌کند: تحلیل فنی عمیق"
description: "معماری فنی جذاب پشت Google Sheets را کاوش کنید، از تکنیک‌های مجازی‌سازی تا رندر canvas، و بیاموزید چرا از عناصر input سنتی استفاده نمی‌کند."
pubDate: 2024-12-28
author: "نوید جلیلیان"
tags: ["توسعه-وب", "عملکرد", "مجازی-سازی", "google-sheets", "تحلیل-فنی"]
heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop"
featured: true
draft: false
lang: "fa"
postSlug: "how-google-sheets-works-under-the-hood"
---

همیشه کنجکاو بوده‌ام که ابزارهای جدید و نوآورانه چگونه در پشت صحنه کار می‌کنند. تصمیمات فنی پشت آن‌ها چیست؟ چرا این انتخاب‌ها؟ چه مشکلاتی را حل می‌کردند؟

پس سری‌ای را شروع می‌کنم که دقیقاً همین کار را می‌کند — تجزیه و تحلیل اینکه ابزارها و ویژگی‌های محبوب چگونه از نظر فنی ساخته شده‌اند. اولین مورد: **Google Sheets.**

## اولین سرنخ: عناصر `<input>` وجود ندارد؟

وقتی اولین بار Google Sheets را باز کردم و DOM را بررسی کردم، چیزی فوراً توجهم را جلب کرد: هیچ عنصر `<input>` در صفحه وجود نداشت.

این تعجب‌آور بود. فکر می‌کردید یک صفحه گسترده پر از input باشد، درست است؟ اما هیچ‌کدام وجود نداشت. چرا؟

## راز: Canvas و Virtualization

پاسخ در معماری Google Sheets نهفته است. به جای استفاده از هزاران عنصر `<input>` (که مرورگر را کند می‌کند)، Google از ترکیب هوشمندانه‌ای استفاده می‌کند:

### 1. Canvas Rendering
```javascript
// مفهوم ساده‌شده
class SpreadsheetRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.cells = new Map();
  }
  
  renderCell(row, col, value) {
    const x = col * this.cellWidth;
    const y = row * this.cellHeight;
    
    // پاک کردن سلول قبلی
    this.ctx.clearRect(x, y, this.cellWidth, this.cellHeight);
    
    // رسم border
    this.ctx.strokeRect(x, y, this.cellWidth, this.cellHeight);
    
    // رسم متن
    this.ctx.fillText(value, x + 5, y + 15);
  }
}
```

### 2. Virtual Scrolling
```javascript
class VirtualGrid {
  constructor() {
    this.viewportStart = { row: 0, col: 0 };
    this.viewportEnd = { row: 20, col: 10 };
    this.totalRows = 1000000; // یک میلیون ردیف!
    this.totalCols = 26000;   // 26 هزار ستون!
  }
  
  onScroll(scrollTop, scrollLeft) {
    // محاسبه سلول‌های قابل مشاهده
    const startRow = Math.floor(scrollTop / this.rowHeight);
    const startCol = Math.floor(scrollLeft / this.colWidth);
    
    // رندر تنها سلول‌های قابل مشاهده
    this.renderVisibleCells(startRow, startCol);
  }
  
  renderVisibleCells(startRow, startCol) {
    // فقط سلول‌هایی که در viewport هستند رندر می‌شوند
    for (let row = startRow; row < startRow + this.visibleRows; row++) {
      for (let col = startCol; col < startCol + this.visibleCols; col++) {
        this.renderCell(row, col);
      }
    }
  }
}
```

## چرا این روش؟

### مشکل روش سنتی
اگر Google Sheets از `<input>` استفاده می‌کرد:

```html
<!-- تصور کنید 1,000,000 × 26,000 تا از اینها! -->
<input class="cell" data-row="0" data-col="0" />
<input class="cell" data-row="0" data-col="1" />
<input class="cell" data-row="0" data-col="2" />
<!-- ... 26 میلیارد input! -->
```

**نتیجه**: مرورگر crash می‌کرد 💥

### راه‌حل هوشمندانه
```javascript
// تنها یک input برای ویرایش فعال
class EditableCell {
  constructor() {
    this.activeInput = document.createElement('input');
    this.activeInput.style.position = 'absolute';
    this.activeInput.style.display = 'none';
  }
  
  startEdit(row, col, x, y) {
    // نمایش input در موقعیت سلول
    this.activeInput.style.left = x + 'px';
    this.activeInput.style.top = y + 'px';
    this.activeInput.style.display = 'block';
    this.activeInput.focus();
    
    this.currentCell = { row, col };
  }
  
  finishEdit() {
    // ذخیره مقدار و مخفی کردن input
    const value = this.activeInput.value;
    this.saveCell(this.currentCell.row, this.currentCell.col, value);
    this.activeInput.style.display = 'none';
  }
}
```

## Event Handling هوشمند

```javascript
class SpreadsheetEventHandler {
  constructor(canvas) {
    this.canvas = canvas;
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    this.canvas.addEventListener('click', (e) => {
      const { row, col } = this.getCellFromCoordinates(e.offsetX, e.offsetY);
      this.selectCell(row, col);
    });
    
    this.canvas.addEventListener('dblclick', (e) => {
      const { row, col } = this.getCellFromCoordinates(e.offsetX, e.offsetY);
      this.startEdit(row, col);
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.finishEdit();
      } else if (e.key === 'Escape') {
        this.cancelEdit();
      }
    });
  }
  
  getCellFromCoordinates(x, y) {
    const col = Math.floor(x / this.cellWidth);
    const row = Math.floor(y / this.cellHeight);
    return { row, col };
  }
}
```

## مدیریت حافظه

### Lazy Loading
```javascript
class CellDataManager {
  constructor() {
    this.loadedChunks = new Map();
    this.chunkSize = 100; // 100×100 سلول در هر chunk
  }
  
  async getCellValue(row, col) {
    const chunkKey = this.getChunkKey(row, col);
    
    if (!this.loadedChunks.has(chunkKey)) {
      // بارگذاری chunk از سرور
      const chunk = await this.loadChunk(chunkKey);
      this.loadedChunks.set(chunkKey, chunk);
    }
    
    return this.loadedChunks.get(chunkKey).getCell(row, col);
  }
  
  getChunkKey(row, col) {
    const chunkRow = Math.floor(row / this.chunkSize);
    const chunkCol = Math.floor(col / this.chunkSize);
    return `${chunkRow}-${chunkCol}`;
  }
}
```

### Memory Cleanup
```javascript
class MemoryManager {
  constructor() {
    this.maxChunks = 50; // حداکثر 50 chunk در حافظه
    this.accessTimes = new Map();
  }
  
  cleanupMemory() {
    if (this.loadedChunks.size > this.maxChunks) {
      // حذف قدیمی‌ترین chunk ها
      const sortedChunks = Array.from(this.accessTimes.entries())
        .sort((a, b) => a[1] - b[1]);
      
      const toRemove = sortedChunks.slice(0, 10);
      toRemove.forEach(([chunkKey]) => {
        this.loadedChunks.delete(chunkKey);
        this.accessTimes.delete(chunkKey);
      });
    }
  }
}
```

## فرمول‌ها و محاسبات

```javascript
class FormulaEngine {
  constructor() {
    this.dependencyGraph = new Map();
    this.calculationQueue = [];
  }
  
  setFormula(row, col, formula) {
    // تجزیه فرمول و شناسایی وابستگی‌ها
    const dependencies = this.parseFormula(formula);
    this.dependencyGraph.set(`${row}-${col}`, dependencies);
    
    // محاسبه مجدد سلول‌های وابسته
    this.recalculateDependents(row, col);
  }
  
  parseFormula(formula) {
    // مثال ساده: =A1+B2
    const cellRefs = formula.match(/[A-Z]+\d+/g) || [];
    return cellRefs.map(ref => this.refToCoords(ref));
  }
  
  recalculateDependents(row, col) {
    // پیدا کردن همه سلول‌هایی که به این سلول وابسته‌اند
    const dependents = this.findDependents(row, col);
    
    // اضافه کردن به صف محاسبه
    dependents.forEach(cell => {
      this.calculationQueue.push(cell);
    });
    
    // اجرای محاسبات
    this.processCalculationQueue();
  }
}
```

## Real-time Collaboration

```javascript
class CollaborationEngine {
  constructor() {
    this.websocket = new WebSocket('wss://sheets.googleapis.com/ws');
    this.operationQueue = [];
    this.setupWebSocket();
  }
  
  setupWebSocket() {
    this.websocket.onmessage = (event) => {
      const operation = JSON.parse(event.data);
      this.applyRemoteOperation(operation);
    };
  }
  
  sendOperation(type, data) {
    const operation = {
      id: this.generateId(),
      type,
      data,
      timestamp: Date.now(),
      userId: this.currentUser.id
    };
    
    // ارسال به سرور
    this.websocket.send(JSON.stringify(operation));
    
    // اعمال محلی
    this.applyLocalOperation(operation);
  }
  
  applyRemoteOperation(operation) {
    // Operational Transformation برای حل تضادها
    const transformedOp = this.transformOperation(operation);
    this.applyOperation(transformedOp);
  }
}
```

## Performance Optimizations

### 1. Rendering Optimizations
```javascript
class OptimizedRenderer {
  constructor() {
    this.renderQueue = [];
    this.isRendering = false;
  }
  
  scheduleRender(row, col) {
    this.renderQueue.push({ row, col });
    
    if (!this.isRendering) {
      requestAnimationFrame(() => this.batchRender());
    }
  }
  
  batchRender() {
    this.isRendering = true;
    
    // گروه‌بندی سلول‌های مجاور
    const batches = this.groupAdjacentCells(this.renderQueue);
    
    batches.forEach(batch => {
      this.renderBatch(batch);
    });
    
    this.renderQueue = [];
    this.isRendering = false;
  }
}
```

### 2. Data Compression
```javascript
class DataCompressor {
  compressRange(startRow, startCol, endRow, endCol, data) {
    // فشرده‌سازی داده‌های تکراری
    const compressed = {
      type: 'range',
      start: [startRow, startCol],
      end: [endRow, endCol],
      patterns: this.findPatterns(data)
    };
    
    return compressed;
  }
  
  findPatterns(data) {
    // شناسایی الگوهای تکراری
    const patterns = [];
    
    // مثال: سلول‌های خالی
    if (data.every(cell => cell.value === '')) {
      patterns.push({ type: 'empty', count: data.length });
    }
    
    return patterns;
  }
}
```

## نتیجه‌گیری

Google Sheets نمونه‌ای عالی از مهندسی نرم‌افزار هوشمندانه است:

### تکنیک‌های کلیدی:
1. **Canvas Rendering**: به جای DOM elements
2. **Virtual Scrolling**: رندر تنها محتوای قابل مشاهده
3. **Lazy Loading**: بارگذاری داده‌ها در صورت نیاز
4. **Memory Management**: پاک‌سازی خودکار حافظه
5. **Batch Operations**: گروه‌بندی عملیات برای بهبود عملکرد

### درس‌های آموخته:
- **Performance First**: عملکرد از ابتدای طراحی در نظر گرفته شده
- **Smart Abstractions**: انتزاع‌های هوشمند برای مخفی کردن پیچیدگی
- **Incremental Loading**: بارگذاری تدریجی برای تجربه بهتر

این معماری اجازه می‌دهد Google Sheets میلیون‌ها سلول را با عملکرد روان مدیریت کند — چیزی که با روش‌های سنتی غیرممکن بود.

*در قسمت بعدی این سری، معماری Figma و نحوه رندر real-time graphics را بررسی خواهیم کرد.*
