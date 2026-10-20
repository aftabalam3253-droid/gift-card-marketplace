import { Request, Response } from 'express';
import pool from '../config/db';

// Get Admin Dashboard Overview Statistics
export const getAdminStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await pool.query('SELECT COUNT(*) FROM users');
    const totalBuyOrders = await pool.query('SELECT COUNT(*) FROM transactions');
    const totalSellRequests = await pool.query('SELECT COUNT(*) FROM gift_cards');
    const pendingVerifications = await pool.query(
      "SELECT COUNT(*) FROM gift_cards WHERE status = 'PENDING' OR status = 'Under Review'"
    );

    const recentBuyOrders = await pool.query(
      `SELECT t.id, u.username, gc.brand, t.amount, 'Completed' as status 
       FROM transactions t
       JOIN users u ON t.buyer_id = u.id
       JOIN gift_cards gc ON t.gift_card_id = gc.id
       ORDER BY t.created_at DESC LIMIT 5`
    );

    const recentSellRequests = await pool.query(
      `SELECT gc.id, u.username, gc.brand, gc.balance, gc.price, COALESCE(gc.status, 'Verified') as status 
       FROM gift_cards gc
       JOIN users u ON gc.seller_id = u.id
       ORDER BY gc.created_at DESC LIMIT 5`
    );

    res.status(200).json({
      stats: {
        totalUsers: totalUsers.rows[0].count,
        totalBuyOrders: totalBuyOrders.rows[0].count,
        totalSellRequests: totalSellRequests.rows[0].count,
        pendingVerifications: pendingVerifications.rows[0].count,
      },
      recentBuyOrders: recentBuyOrders.rows,
      recentSellRequests: recentSellRequests.rows,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
// Get all pending verification cards
// Get all pending verification cards
export const getVerificationQueue = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT * FROM gift_cards 
       WHERE UPPER(status) = 'PENDING' OR status IS NULL 
       ORDER BY id DESC`
    );
    
    res.status(200).json(result.rows);
  } catch (err: any) {
    console.error('Error fetching verification queue:', err);
    res.status(500).json({ message: err.message });
  }
};

// Update card status (Verify / Reject)
export const updateCardStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cardId, status } = req.body; // status: 'VERIFIED' or 'REJECTED'
    
    await pool.query(
      'UPDATE gift_cards SET status = $1 WHERE id = $2',
      [status, cardId]
    );

    res.status(200).json({ message: `Card ${status.toLowerCase()} successfully!` });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
// 1. Get all pending/all sell requests
export const getSellRequests = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM gift_cards ORDER BY created_at DESC"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching sell requests:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// 2. Update Sell Request Status (Verify or Reject)
export const updateSellRequestStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // 'verified' ya 'rejected'

  try {
    const result = await pool.query(
      "UPDATE gift_cards SET status = $1 WHERE id = $2 RETURNING *",
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
    res.status(500).json({ error: 'Server error' });
  }
};