import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from "../../components/ui/button";
import { toast } from 'sonner';
import api from '../../libs/apiCall';
import { BiLoader } from 'react-icons/bi';

const EmailVerifed = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                if(!token) {
                    toast.error('No verification token provided');
                    setLoading(false);
                    return;
                }

                const { data: res } = await api.post('/auth/verify-email',
                    { userId },
                    { params: { token } }
                );

                if(res?.success) {
                    setVerified(true);
                    toast.success(res.message || 'Email verified successfully!');

                    setTimeout(() => {
                        navigate('/sign-in');
                    }, 3000);
                }
            }catch (error) {
            toast.error(error?.response?.data?.message || 'Verification failed');
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };
    verifyEmail();
    }, [token, userId, navigate]);

    if (loading) {
        return (
            <div className='flex items-center justify-center w-full min-h-screen'>
                <BiLoader className='text-4xl animate-spin text-violet-600' />
            </div>
        );
    }

    return (
        <div className='flex items-center justify-center w-full min-h-screen py-10'>
            <Card className='w-[400px] bg-white dark:bg-black/20 shadow-md'>
                <CardHeader className='text-center'>
                    <CardTitle className={verified ? 'text-green-600' : 'text-red-600'}>
                        {verified ? '✓ Email Verified' : '✗ Verification Failed'}
                    </CardTitle>
                </CardHeader>
                <CardContent className='text-center space-y-4'>
                    <p className='text-gray-600 dark:text-gray-400'>
                        {verified 
                            ? 'Your email has been verified successfully. Redirecting to login...'
                            : 'We could not verify your email. The link may be expired or invalid.'}
                    </p>
                    {!verified && (
                        <Button
                            onClick={() => navigate('/sign-up')}
                            className='w-full'
                        >
                            Back to Sign Up
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default EmailVerifed;