---
title: "Solving the 24 Game with Algorithms: From Math Puzzles to Code"
description: "Explore how to solve the classic 24 Game puzzle using algorithmic thinking and JavaScript. Includes interactive demo and complete implementation."
pubDate: 2024-12-28
author: "Navid Jalilian"
tags: ["algorithms", "javascript", "math", "problem-solving", "programming"]
heroImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&h=400&fit=crop"
featured: false
draft: false
lang: "en"
---

I'd just started reading a math book, after all the crap our schools were pushing, I decided to learn only what I enjoyed, so I grabbed _[Art of Problem Solving (AoPS) Prealgebra](https://www.amazon.com/Prealgebra-Richard-Rusczyk/dp/1934124214)_. I was determined to treat every exercise like a game instead of a chore, and I ended up having a blast in the very first hour.

One puzzle there is the "24 Game": you're given four numbers and must use arithmetic to make 24. I wondered how I could solve those puzzles faster, so I began exploring how algorithms might help and in the process, learn a lot more.

One straightforward, complete approach is simply to test every possible combination of operations on the given numbers.

## The 24 Game Puzzle

> **Puzzle.** Given four positive numbers (e.g. 3, 4, 2, 8), insert the operations +, −, ×, ÷ and parentheses so that the result is exactly 24.  
> **Example solution:** (8*(2-(3-4))) = 24

## A Straightforward Brute-Force Approach

The simplest algorithm is:

1. **Pick** any two of the remaining numbers.
2. **Apply** one of the four operations (skipping division by zero).
3. **Replace** the pair by their result (so the list shrinks by one).
4. **Recurse** until only one number remains—check if it's (approximately) 24.

Because subtraction and division aren't commutative, you also try each pair in both orders.

Also, I created an interactive demo so you can see how it's working: [codepen](https://codepen.io/Navid-Jalilian/full/qEdEyWw)

## Complete Implementation

```javascript
class Token {
  constructor(value, expr) {
    this.value = value;
    this.expr  = expr;
  }
}

const TARGET = 24;
const EPS    = 1e-6;

function applyOp(op, x, y) {
  switch (op) {
    case '+': return x + y;
    case '-': return x - y;
    case '*': return x * y;
    case '/': return x / y;
  }
}

function solve(tokens, solutions) {
  if (tokens.length === 1) {
    if (Math.abs(tokens[0].value - TARGET) < EPS) {
      solutions.add(tokens[0].expr);
    }
    return;
  }

  for (let i = 0; i < tokens.length; i++) {
    for (let j = i + 1; j < tokens.length; j++) {
      const a = tokens[i], b = tokens[j];
      const rest = tokens.filter((_, k) => k !== i && k !== j);

      ['+', '-', '*', '/'].forEach(op => {
        // a op b
        if (!(op === '/' && Math.abs(b.value) < EPS)) {
          const r    = applyOp(op, a.value, b.value),
                expr = `(${a.expr}${op}${b.expr})`;
          solve([...rest, new Token(r, expr)], solutions);
        }
        // b op a if non-commutative
        if ((op === '-' || op === '/') && !(op === '/' && Math.abs(a.value) < EPS)) {
          const r2    = applyOp(op, b.value, a.value),
                expr2 = `(${b.expr}${op}${a.expr})`;
          solve([...rest, new Token(r2, expr2)], solutions);
        }
      });
    }
  }
}

function findSolutions(nums) {
  const tokens = nums.map(n => new Token(n, n.toString()));
  const sols   = new Set();
  solve(tokens, sols);
  return Array.from(sols);
}

// Demo
console.log(findSolutions([3,4,2,8]));
```

## How the Algorithm Works

### Step-by-Step Breakdown

1. **Token Class**: Each number is wrapped in a `Token` object that stores both the numeric value and the string expression that created it.

2. **Recursive Structure**: The algorithm recursively reduces the list of tokens by combining pairs until only one remains.

3. **Operation Handling**: For each pair of numbers, we try all four operations (+, -, *, /).

4. **Commutativity**: Addition and multiplication are commutative (a+b = b+a), but subtraction and division are not, so we try both orders.

5. **Division by Zero**: We check for division by zero using a small epsilon value to handle floating-point precision.

### Example Execution

For input `[3, 4, 2, 8]`:

1. Try combining 3 and 4: `3+4=7`, `4-3=1`, `3*4=12`, etc.
2. For each result, recursively solve with the remaining numbers
3. Continue until we find expressions that equal 24

## Optimizations and Variations

### Performance Improvements

- **Memoization**: Cache results for repeated subproblems
- **Early Termination**: Stop exploring branches that can't reach 24
- **Pruning**: Eliminate equivalent expressions (e.g., `a+b` vs `b+a`)

### Extended Versions

- **More Operations**: Add exponentiation, square roots, factorials
- **More Numbers**: Extend to 5 or 6 numbers
- **Different Targets**: Solve for numbers other than 24

## Mathematical Insights

The 24 Game reveals interesting properties:

- **Solvability**: Not all combinations of four numbers have solutions
- **Multiple Solutions**: Many combinations have numerous valid expressions
- **Operation Frequency**: Multiplication and division often appear in solutions due to the target being 24 (2³ × 3)

## Educational Value

This puzzle demonstrates several computer science concepts:

- **Recursion**: Breaking down complex problems into simpler subproblems
- **Tree Traversal**: Exploring all possible expression trees
- **Combinatorics**: Understanding the number of possible arrangements
- **Floating-Point Arithmetic**: Handling precision issues in calculations

The 24 Game is more than just a math puzzle—it's a gateway to understanding algorithmic thinking and the beauty of systematic problem-solving. Whether you're learning programming or just enjoy mathematical challenges, implementing a solver teaches valuable lessons about recursion, search algorithms, and the elegance of well-structured code.
