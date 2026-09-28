import mongoose from "mongoose";
const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'Name must be at least 3 characters long'],
        maxLength: [50, 'Name must be at most 50 characters long']
    },
    price: {
        type: Number,
        required: true,
        min: 0

    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD','IDR'],
        default: 'USD',
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    category: {
        type: String,
        enum: ['entertainment', 'productivity', 'education', 'health', 'other'],
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'paypal', 'bank_transfer', 'crypto'],
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'canceled', 'expired'],
        default: 'active'
    },
    startDate: {
        type: Date,
        required: true,
        validate:
            {
                validator: (value) => value <= new Date(),
                message: 'Start date must be in the past',
            }

    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: 'Renewal date must be after start date'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }


}, { timestamps: true });


subscriptionSchema.pre('save',async function() {
    if (!this.renewalDate){
        const renewalPeriods={
        daily: 1,
        weekly: 7,
        monthly: 30,
        yearly: 365    
        };

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }
    if (this.renewalDate < new Date()) {
        this.status='expired';
    }

    
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;