import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from "../../components/ui/button";
import { toast } from 'sonner';
import api from '../../libs/apiCall';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const email = localStorage.getItem('pendingEmail');
    // const email = new URLSearchParams(window.location.search).get('email');

    const hanndleResendVerificationEmail = async () => {
        try{
            setLoading(true);
            await api.post('/auth/resend-verification-email', { email });
            toast.success('Verification email resent');
        }catch(error){
            toast.error(error.response?.data?.message || 'Failed to resend verification email');
        }finally{
            setLoading(false);
        }
    };

    return (
        <div className='flex items-center justify-center w-full min-h-screen py-10'>
            <Card className='w-[400px] bg-white dark:bg-black/20 shadow-md'>
                <CardHeader className='text-center'>
                    <CardTitle className='dark:text-white'>Verify Your Email</CardTitle>
                </CardHeader>
                <CardContent className='text-center space-y-4'>
                    <p className='text-gray-600 dark:text-gray-400'>
                        We've sent a verification link to <strong>{email}</strong>
                    </p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Click the link in your email to verify your account
                    </p>
                </CardContent>

                <Button 
                onClick={hanndleResendVerificationEmail}
                disabled={loading}
                className='w-full mt-6'
                >
                    {loading ? 'Resemding...' : 'Resend Verification Email'}
                </Button>
            </Card>
        </div>
    )
}

export default VerifyEmail;