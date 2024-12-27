1. nest new teebay-backend

2. then inside root directory 
npm install @nestjs/graphql @nestjs/apollo graphql apollo-server-express prisma @prisma/client

3.npx prisma init

4.after completing prisma schema
npx prisma migrate dev --name init

5.npx prisma generate

6.after creating seed.ts for category
npx ts-node prisma/seed.ts

7.inside root directory 
npm install bcrypt
npm install --save-dev @types/bcrypt

8.inside root directory 
npm install class-validator

