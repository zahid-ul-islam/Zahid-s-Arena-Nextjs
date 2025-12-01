#!/bin/bash

# Quick Deployment Setup Script for Zahid's Arena

echo "🚀 Setting up deployment files..."

# Create .env.example if it doesn't exist
if [ ! -f .env.example ]; then
    cat > .env.example << 'EOF'
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/football-kits?retryWrites=true&w=majority

# JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your-super-secret-jwt-key-here

# Environment
NODE_ENV=development
EOF
    echo "✅ Created .env.example"
else
    echo "⚠️  .env.example already exists"
fi

echo ""
echo "📝 Next Steps:"
echo "1. Push your code to GitHub"
echo "2. Sign up at vercel.com"
echo "3. Import your repository"
echo "4. Add environment variables from .env.example"
echo "5. Deploy!"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
