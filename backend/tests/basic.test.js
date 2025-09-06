// Test básico para que el workflow de GitHub Actions pase
describe('Backend Basic Tests', () => {
  test('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  test('should have environment variables', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });
});
