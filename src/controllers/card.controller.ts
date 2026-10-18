import { Request, Response } from 'express';
import pool from '../config/db';

// Get all brands for searchable autocomplete & popular tags
export const getBrands = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM brands ORDER BY is_popular DESC, name ASC');
    res.status(200).json(result.rows);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Create Gift Card (with auto brand saving)
export const createGiftCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, brand, card_number, pin, balance, price, seller_id } = req.body;

    const cleanBrand = brand ? brand.trim() : '';
    if (cleanBrand) {
      await pool.query(
        'INSERT INTO brands (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
        [cleanBrand]
      );
    }

   // Example: Card Insert Query Update
    const newCard = await pool.query(
      `INSERT INTO gift_cards (title, brand, card_number, pin, balance, price, seller_id, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title, brand, card_number, pin, balance, price, seller_id, 'PENDING']
    );

    res.status(201).json({ message: 'Gift card created successfully', card: newCard.rows[0] });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get all unsold gift cards
export const getGiftCards = async (req: Request, res: Response): Promise<void> => {
  try {
    const cards = await pool.query(
      "SELECT * FROM gift_cards WHERE UPPER(status) = 'VERIFIED' ORDER BY id DESC"
    );
    res.status(200).json(cards.rows);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Buy Gift Card
export const buyGiftCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cardId, buyerId } = req.body;

    const cardResult = await pool.query('SELECT * FROM gift_cards WHERE id = $1', [cardId]);
    if (cardResult.rows.length === 0) {
      res.status(404).json({ message: 'Gift card not found' });
      return;
    }

    const card = cardResult.rows[0];
    if (card.is_sold) {
      res.status(400).json({ message: 'This gift card is already sold' });
      return;
    }

    await pool.query('UPDATE gift_cards SET is_sold = TRUE WHERE id = $1', [cardId]);

    const transaction = await pool.query(
      `INSERT INTO transactions (gift_card_id, buyer_id, amount) 
       VALUES ($1, $2, $3) RETURNING *`,
      [cardId, buyerId || 1, card.price]
    );

    res.status(200).json({
      message: 'Gift card purchased successfully!',
      cardCode: card.card_number,
      cardPin: card.pin,
      transaction: transaction.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get cards bought by specific user
export const getMyPurchasedCards = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT gc.*, t.created_at as purchase_date 
       FROM transactions t 
       JOIN gift_cards gc ON t.gift_card_id = gc.id 
       WHERE t.buyer_id = $1 
       ORDER BY t.created_at DESC`,
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get cards listed for sale by specific user
export const getMyListedCards = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT * FROM gift_cards WHERE seller_id = $1 ORDER BY id DESC',
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};