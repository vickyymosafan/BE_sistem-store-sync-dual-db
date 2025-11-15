# Contributing to PT Indo Agustus

Terima kasih atas minat Anda untuk berkontribusi pada project ini! 🎉

## 📋 Code of Conduct

Dengan berpartisipasi dalam project ini, Anda diharapkan untuk menjaga lingkungan yang ramah dan profesional.

## 🚀 Cara Berkontribusi

### 1. Fork Repository

```bash
# Fork repository melalui GitHub UI
# Clone fork Anda
git clone https://github.com/vickyymosafan/BE_sistem-store-sync-dual-db.git
cd BE_sistem-store-sync-dual-db
```

### 2. Buat Branch Baru

```bash
# Buat branch untuk fitur atau bugfix
git checkout -b feature/nama-fitur
# atau
git checkout -b fix/nama-bug
```

### 3. Lakukan Perubahan

- Tulis kode yang clean dan mudah dipahami
- Ikuti style guide yang ada
- Tambahkan komentar jika diperlukan
- Update dokumentasi jika ada perubahan API

### 4. Commit Changes

Gunakan conventional commit format:

```bash
# Format: <type>(<scope>): <subject>

# Contoh:
git commit -m "feat(prices): add price history feature"
git commit -m "fix(sync): resolve timezone issue in date comparison"
git commit -m "docs(readme): update installation guide"
```

**Commit Types:**
- `feat`: Fitur baru
- `fix`: Bug fix
- `docs`: Perubahan dokumentasi
- `style`: Format code (tidak mengubah logic)
- `refactor`: Refactoring code
- `test`: Menambah atau update tests
- `chore`: Maintenance tasks

### 5. Push ke Fork

```bash
git push origin feature/nama-fitur
```

### 6. Buat Pull Request

- Buka GitHub dan buat Pull Request dari fork Anda
- Jelaskan perubahan yang Anda buat
- Reference issue yang terkait (jika ada)

## 🎨 Style Guide

### TypeScript/JavaScript

```typescript
// ✅ Good
async function getUserById(id: string): Promise<User> {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}

// ❌ Bad
async function getUser(id) {
  return await userRepository.findById(id);
}
```

### Naming Conventions

- **Variables/Functions:** camelCase (`getUserData`, `totalPrice`)
- **Classes/Interfaces:** PascalCase (`UserRepository`, `PriceDTO`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`, `API_BASE_URL`)
- **Files:** kebab-case (`user-repository.ts`, `price-handler.ts`)

### Code Organization

```
backend/src/
├── domain/          # Business logic
│   ├── entities/    # Domain models
│   ├── repositories/# Repository interfaces
│   └── usecases/    # Use cases
├── infra/           # Infrastructure
│   ├── db/          # Database clients
│   ├── repositories/# Repository implementations
│   └── mappers/     # Data mappers
└── http/            # HTTP layer
    ├── handlers/    # Request handlers
    ├── routes/      # Route definitions
    └── schemas/     # Validation schemas
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test
npm test -- user.test.ts
```

## 📝 Documentation

- Update README.md jika ada perubahan fitur
- Tambahkan JSDoc untuk fungsi public
- Update UI-DOCUMENTATION.md untuk perubahan UI
- Buat file BUGFIX-*.md untuk dokumentasi bug fix

## 🐛 Melaporkan Bug

Gunakan GitHub Issues dengan template:

```markdown
**Deskripsi Bug:**
Jelaskan bug yang terjadi

**Cara Reproduksi:**
1. Buka halaman X
2. Klik tombol Y
3. Lihat error Z

**Expected Behavior:**
Apa yang seharusnya terjadi

**Screenshots:**
Tambahkan screenshot jika ada

**Environment:**
- OS: Windows 10
- Browser: Chrome 120
- Node: v20.10.0
```

## 💡 Request Fitur

Gunakan GitHub Issues dengan template:

```markdown
**Fitur yang Diinginkan:**
Jelaskan fitur yang Anda inginkan

**Use Case:**
Kapan fitur ini akan digunakan?

**Alternatif:**
Apakah ada alternatif yang sudah Anda pertimbangkan?

**Additional Context:**
Informasi tambahan
```

## ✅ Pull Request Checklist

Sebelum submit PR, pastikan:

- [ ] Code sudah di-test dan berjalan dengan baik
- [ ] Tidak ada error di console
- [ ] Code sudah di-lint (`npm run lint`)
- [ ] Code sudah di-format (`npm run format`)
- [ ] Dokumentasi sudah di-update
- [ ] Commit message mengikuti conventional format
- [ ] PR description jelas dan lengkap

## 🔍 Review Process

1. Maintainer akan review PR Anda
2. Jika ada feedback, lakukan perubahan yang diminta
3. Setelah approved, PR akan di-merge
4. Branch akan di-delete setelah merge

## 📞 Kontak

Jika ada pertanyaan, silakan:
- Buka GitHub Issue
- Email: mvickymosafan@gmail.com

## 🙏 Terima Kasih!

Kontribusi Anda sangat berarti untuk project ini! 🎉
