// Script simple para crear usuario administrador
// Requiere: tener las variables de entorno configuradas

console.log('📋 INSTRUCCIONES PARA CREAR USUARIO ADMINISTRADOR');
console.log('==================================================');
console.log('\n1. 📝 Verifica que tienes estas variables en tu .env.local:');
console.log('   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co');
console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key');
console.log('   SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key');
console.log('\n2. 🔑 Para obtener la SERVICE ROLE KEY:');
console.log('   a. Ve a tu proyecto Supabase');
console.log('   b. Configuración → API');
console.log('   c. Copia la "service_role" key (NO la anon key)');
console.log('\n3. 👤 Crear usuario manualmente desde Supabase Dashboard:');
console.log('   a. Ve a: https://supabase.com/dashboard/project/_/auth/users');
console.log('   b. Haz clic en "Invite User"');
console.log('   c. Email: vilkmet@gmail.com');
console.log('   d. Marca "Auto confirm user?"');
console.log('   e. Haz clic en "Invite"');
console.log('   f. Luego haz clic en los tres puntos junto al usuario');
console.log('   g. Selecciona "Reset password"');
console.log('   h. Establece la contraseña: Vilkmet*1414');
console.log('\n4. 🚀 Alternativa: Ejecutar desde línea de comandos Supabase CLI:');
console.log('   supabase auth users create vilkmet@gmail.com --password Vilkmet*1414 --confirm');
console.log('\n5. 🔧 Si necesitas ayuda adicional, ejecuta:');
console.log('   node scripts/create-admin-user.js');
console.log('\n📧 Credenciales a usar:');
console.log('   Email: vilkmet@gmail.com');
console.log('   Contraseña: Vilkmet*1414');