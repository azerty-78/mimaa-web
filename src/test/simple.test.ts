import { describe, it, expect } from 'vitest'

describe('Tests de base', () => {
  it('should pass basic math test', () => {
    expect(2 + 2).toBe(4)
  })

  it('should handle string operations', () => {
    const str = 'Hello World'
    expect(str.toLowerCase()).toBe('hello world')
    expect(str.length).toBe(11)
  })

  it('should handle array operations', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(arr.length).toBe(5)
    expect(arr.includes(3)).toBe(true)
    expect(arr.filter(n => n > 3)).toEqual([4, 5])
  })

  it('should handle object operations', () => {
    const obj = { name: 'Test', age: 25, active: true }
    expect(obj.name).toBe('Test')
    expect(obj.age).toBe(25)
    expect(obj.active).toBe(true)
  })
})
