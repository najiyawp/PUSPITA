import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const CartIcon = ({ className = '', iconClassName = 'w-6 h-6' }) => {
    const navigate = useNavigate();
    const { totalItems } = useCart();

    return (
        <button
            onClick={() => navigate('/cart')}
            className={`relative ${className}`}
            aria-label={`Keranjang (${totalItems} item)`}
        >
            <FiShoppingCart className={`text-[#efaca5] ${iconClassName}`} />
            {totalItems > 0 && (
                <span
                    className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-[#3e8440] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none shadow-md animate-bounce-once"
                    style={{ fontFamily: 'sans-serif' }}
                >
                    {totalItems > 99 ? '99+' : totalItems}
                </span>
            )}
        </button>
    );
};

export default CartIcon;