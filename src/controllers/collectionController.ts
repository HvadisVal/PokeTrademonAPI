import { Request, Response } from "express";
import User from "../models/User";

export const addCardToCollection = async (req: Request, res: Response) => {
  try {
    const { userId, cardId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.collection.push(cardId);
    await user.save();
    res.json({ message: "Card added to collection", collection: user.collection });
  } catch (error) {
    res.status(500).json({ message: "Error adding card" });
  }
};

