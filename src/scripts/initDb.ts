import pool from '../config/db';

const createTables = async () => {
  const queryText = `
    -- Users Table
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'user', -- 'user' ya 'admin'
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Gift Cards Table
    CREATE TABLE IF NOT EXISTS gift_cards (
      id SERIAL PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      brand VARCHAR(100) NOT NULL,
      card_number VARCHAR(100) NOT NULL,
      pin VARCHAR(50),
      balance DECIMAL(10, 2) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      status VARCHAR(20) DEFAULT 'available', -- 'available', 'sold', 'pending'
      seller_id INT REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Transactions Table
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      card_id INT REFERENCES gift_cards(id) ON DELETE CASCADE,
      buyer_id INT REFERENCES users(id) ON DELETE CASCADE,
      amount DECIMAL(10, 2) NOT NULL,
      transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(queryText);
    console.log('✅ All Database Tables Created Successfully!');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
  } finally {
    await pool.end();
  }
};

createTables();