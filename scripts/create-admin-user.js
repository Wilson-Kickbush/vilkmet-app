// Script para crear usuario administrador en Supabase
// Ejecutar con: node scripts/create-admin-user.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function createAdminUser() {
  // Verificar variables de entorno
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Necesitas esta clave
  
  if (!supabaseUrl) {
    console.error('❌ ERROR: NEXT_PUBLIC_SUPABASE_URL no está definido en .env.local');
    console.log('Agrega esta línea a tu .env.local:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co');
    return;
  }
  
  if (!supabaseServiceKey) {
    console.error('❌ ERROR: SUPABASE_SERVICE_ROLE_KEY no está definido en .env.local');
    console.log('\nPara obtener la Service Role Key:');
    console.log('1. Ve a tu proyecto Supabase');
    console.log('2. Configuración del proyecto → API');
    console.log('3. Copia la "service_role" key (NO la anon key)');
    console.log('4. Agrega esta línea a tu .env.local:');
    console.log('SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui');
    console.log('\n⚠️  ADVERTENCIA: La service role key tiene acceso total, mantenla segura!');
    return;
  }

  // Crear cliente con service role key (permite crear usuarios)
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const adminEmail = 'vilkmet@gmail.com';
  const adminPassword = 'Vilkmet*1414';

  try {
    console.log('🔄 Creando usuario administrador...');
    
    // Crear usuario con Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Confirmar email automáticamente
      user_metadata: {
        role: 'admin',
        name: 'Administrador VILKMET'
      }
    });

    if (authError) {
      console.error('❌ Error creando usuario:', authError.message);
      
      // Si el usuario ya existe, intentar actualizar la contraseña
      if (authError.message.includes('already registered')) {
        console.log('⚠️  El usuario ya existe. Intentando actualizar contraseña...');
        
        // Actualizar contraseña del usuario existente
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          authData?.user?.id || '', // Necesitaríamos el ID del usuario
          { password: adminPassword }
        );
        
        if (updateError) {
          console.error('❌ Error actualizando contraseña:', updateError.message);
          console.log('\n💡 Alternativa: Restablece la contraseña manualmente desde:');
          console.log(`${supabaseUrl}/project/_/auth/users`);
        } else {
          console.log('✅ Contraseña actualizada correctamente');
          console.log(`📧 Email: ${adminEmail}`);
          console.log(`🔑 Contraseña: ${adminPassword}`);
        }
      }
      return;
    }

    console.log('✅ Usuario administrador creado exitosamente!');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Contraseña: ${adminPassword}`);
    console.log(`👤 ID: ${authData.user.id}`);
    
    // Opcional: Asignar rol en la base de datos si es necesario
    console.log('\n🎉 Ahora puedes iniciar sesión en:');
    console.log('http://localhost:3000/login');
    console.log('\nCon las credenciales:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Contraseña: ${adminPassword}`);

  } catch (error) {
    console.error('❌ Error inesperado:', error);
  }
}

// Ejecutar el script
createAdminUser();