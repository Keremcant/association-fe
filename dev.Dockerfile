# Node.js'in LTS sürümünü kullan
FROM node:lts

# Çalışma dizini olarak /app klasörünü oluştur
WORKDIR /app

# Eski node_modules ve package-lock.json dosyalarını sil
RUN rm -rf node_modules package-lock.json

# Sadece package.json ve package-lock.json dosyalarını kopyala
COPY package.json package-lock.json ./

# npm'i güncelle
RUN npm install -g npm@latest

# Bağımlılıkları yükle, legacy-peer-deps parametresi ile eski bağımlılıkları çöz
RUN npm install --legacy-peer-deps

# Projenin tamamını kopyala
COPY . .

# Gerekirse rollup bağımlılığını manuel yükle
RUN npm install rollup@latest --force

# Uygulamayı development modda çalıştır ve --host parametresi ile tüm ağlardan erişilebilir yap
CMD ["npm", "run", "dev", "--host"]
