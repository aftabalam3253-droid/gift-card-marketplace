import { Request, Response } from 'express';
import { pool } from '../config/db';

// 1. Get Admin Stats (Dashboard Summary)
export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as total_cards FROM gift_cards');
    res.status(200).json({ 
      totalCards: result.rows[0].total_cards,
      activeUsers: 0 // aap apne hisab se expand kar sakte hain
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
};

// 2. Get Pending Verification Queue
export const getVerificationQueue = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        gc.id,
        gc.title,
        gc.brand,
        gc.card_number,
        gc.pin,
        gc.balance,
        gc.price,
        gc.status,
        gc.seller_id,
        gc.created_at,
        gc.is_sold,
        u.email as seller_email
      FROM gift_cards gc
      LEFT JOIN users u ON gc.seller_id = u.id
      WHERE gc.status IS NULL OR gc.status = 'pending' OR gc.status = 'available'
      ORDER BY gc.id DESC
    `);
    
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching verification queue:', err);
    res.status(500).json({ error: 'Failed to fetch pending verifications' });
  }
};

// 3. Get All Sell Requests
export const getSellRequests = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        gc.id,
        gc.title,
        gc.brand,
        gc.card_number,
        gc.pin,
        gc.balance,
        gc.price,
        gc.status,
        gc.seller_id,
        gc.created_at,
        gc.is_sold,
        u.email as seller_email
      FROM gift_cards gc
      LEFT JOIN users u ON gc.seller_id = u.id
      ORDER BY gc.id DESC
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching sell requests:', err);
    res.status(500).json({ error: 'Failed to fetch sell requests' });
  }
};
// 4. Update Status (Verify or Reject)
export const updateSellRequestStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; 

  try {
    const result = await pool.query(
      `UPDATE gift_cards 
       SET status = $1 
       WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sell request not found' });
    }

    res.status(200).json({ 
      message: `Card status updated to ${status} successfully`, 
      card: result.rows[0] 
    });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ error: 'Failed to update request status' });
  }
};