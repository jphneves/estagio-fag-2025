#!/bin/bash

# Script de instalação e configuração do projeto

echo "🚀 Instalando dependências do projeto..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend
echo -e "${BLUE}📦 Instalando dependências do backend...${NC}"
cd backend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependências do backend instaladas com sucesso!${NC}"
else
    echo -e "${YELLOW}⚠ Erro ao instalar dependências do backend${NC}"
    exit 1
fi
cd ..

echo ""

# Frontend
echo -e "${BLUE}📦 Instalando dependências do frontend...${NC}"
cd frontend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependências do frontend instaladas com sucesso!${NC}"
else
    echo -e "${YELLOW}⚠ Erro ao instalar dependências do frontend${NC}"
    exit 1
fi
cd ..

echo ""
echo -e "${GREEN}✅ Instalação concluída com sucesso!${NC}"
echo ""
echo -e "${YELLOW}📋 Próximos passos:${NC}"
echo ""
echo "1. Configure o PostgreSQL e crie o banco de dados:"
echo "   sudo -u postgres psql -c \"CREATE DATABASE sistema_rbac;\""
echo ""
echo "2. Execute as migrations do banco:"
echo "   cd backend && npm run migrate"
echo ""
echo "3. Execute o seed para criar dados iniciais:"
echo "   npm run seed"
echo ""
echo "4. Inicie o backend (em um terminal):"
echo "   npm run dev"
echo ""
echo "5. Inicie o frontend (em outro terminal):"
echo "   cd ../frontend && npm run dev"
echo ""
echo "6. Acesse o sistema em: http://localhost:3000"
echo ""
echo -e "${BLUE}Credenciais de teste:${NC}"
echo "Admin: admin@example.com / admin123"
echo "Manager: manager@example.com / manager123"
echo "User: user@example.com / user123"
