import React, {useState} from "react";
import { apiService } from "../services/apiService";
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

export const ClienteDashboard = ({}) => {

    return(
        <div className="max-w-lg w-full mx-auto my-12 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-pink-100/50 overflow-hidden border border-pink-100">
            <div className="bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-500 px-6 py-6 text-center text-white shadow-sm">
                <h2 className="text-2xl font-bold drop-shadow-sm">
                    Bienvenido Clientukis
                </h2>
            </div>
        </div>
    )
}