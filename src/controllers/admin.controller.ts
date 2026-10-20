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

// 1. Get Pending Verification Queue (For Verification Center)
export const getVerificationQueue = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        gc.id,
        gc.brand_name,
        gc.amount,
        gc.selling_price,
        gc.card_number,
        gc.pin,
        gc.status,
        gc.created_at,
        u.email as seller_email,
        u.id as user_id
      FROM gift_cards gc
      LEFT JOIN users u ON gc.user_id = u.id
      WHERE gc.status = 'pending' OR gc.status = 'under_review'
      ORDER BY gc.created_at ASC
    `);
    
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching verification queue:', err);
    res.status(500).json({ error: 'Failed to fetch pending verifications' });
  }
};

// 2. Get All Sell Requests (For Sell Requests List)
export const getSellRequests = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        gc.id,
        gc.brand_name,
        gc.amount,
        gc.selling_price,
        gc.card_number,
        gc.pin,
        gc.status,
        gc.created_at,
        u.email as seller_email
      FROM gift_cards gc
      LEFT JOIN users u ON gc.user_id = u.id
      ORDER BY gc.created_at DESC
    `);
    
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching sell requests:', err);
    res.status(500).json({ error: 'Failed to fetch sell requests' });
  }
};

// 3. Update Status (With Rejection Reason / Approval Audit)
export const updateSellRequestStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, rejection_reason } = req.body; // 'verified' or 'rejected'

  try {
    const result = await pool.query(
      `UPDATE gift_cards 
       SET status = $1, rejection_reason = $2, updated_at = NOW() 
       WHERE id = $3 RETURNING *`,
      [status, rejection_reason || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sell request not found' });
    }

    res.status(200).json({ 
      message: `Card has been successfully marked as ${status}`, 
      card: result.rows[0] 
    });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ error: 'Failed to update request status' });
  }
};