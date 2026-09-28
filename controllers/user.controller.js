import User from "../models/user.model.js";

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
}

export const updateUser = async (req, res, next) => {
    try {
        // Pastikan user hanya bisa update dirinya sendiri
        if (req.user.id !== req.params.id) {
            const error = new Error('You are not authorized to update this account');
            error.statusCode = 403;
            throw error;
        }

        // Jangan biarkan password diupdate lewat endpoint ini
        const { password, ...updateData } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        // Pastikan user hanya bisa delete dirinya sendiri
        if (req.user.id !== req.params.id) {
            const error = new Error('You are not authorized to delete this account');
            error.statusCode = 403;
            throw error;
        }

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
}
