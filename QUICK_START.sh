#!/bin/bash

echo "🚀 Quick Start - Video Player + Notes"
echo "======================================"
echo ""

# Check if Convex is configured
if [ ! -f "packages/backend/.env.local" ]; then
    echo "⚠️  Convex n'est pas configuré."
    echo ""
    echo "Pour configurer Convex:"
    echo "1. cd packages/backend"
    echo "2. npm run setup"
    echo "3. Suivez les instructions à l'écran"
    echo ""
    read -p "Voulez-vous configurer maintenant? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd packages/backend
        npm run setup
        cd ../..
    else
        echo "Abandonné. Configurez Convex plus tard."
        exit 1
    fi
fi

# Check if web env is configured
if [ ! -f "apps/web/.env.local" ]; then
    echo "⚠️  Configuration web manquante."
    echo ""
    echo "Créez apps/web/.env.local avec:"
    echo "  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=..."
    echo "  CLERK_SECRET_KEY=..."
    echo "  NEXT_PUBLIC_CONVEX_URL=..."
    echo ""
    exit 1
fi

echo "✅ Tout semble configuré!"
echo ""
echo "🚀 Démarrage de l'application..."
npm run dev
