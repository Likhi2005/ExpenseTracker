import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import api from "../libs/apiCall";
import { Button } from "./ui/button";
import { BiLoader } from "react-icons/bi";
import Input from "./ui/input";




export const ChangePassword = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm();

    const [loading, setLoading] = useState(false);

    const submitPasswordHandler = async (data) => {
        console.log(data)
        try {
            setLoading(true);

            const { data: res } = await api.put(`/user/change-password`, data);

            if (res?.status === "success") {
                toast.success(res?.message);
            }
        } catch (error) {
            console.error("Something went wrong:", error);
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    }

    
    return <div className="py-20">
        <form onSubmit={handleSubmit(submitPasswordHandler)}>
            <div className="">
                <p className="dark:text-gray-400">Change Password</p>
                <span className="dark:text-gray-400">
                    This will be used to log into your account and complete high severity actions.
                </span>
            </div>

            <div className="mt-6 space-y-6">
                <Input
                    disabled={loading}
                    type='password'
                    name='currentPassword'
                    className='inputStyle'
                    label='Current Password'
                    {...register("currentPassword", {
                        required: "Current Password is required!",
                    })}
                    error={errors.currentPassword ? errors.currentPassword.message : ""}
                />

                <Input
                    disabled={loading}
                    type='password'
                    name='newPassword'
                    label='New Password'
                    className='inputStyle'
                    {...register("newPassword", {
                        required: "New Password is required!",
                    })}
                    error={errors.newPassword ? errors.newPassword.message : ""}
                />

                <Input
                    disabled={loading}
                    type='password'
                    name='confirmPassword'
                    label='Confirm Password'
                    className='inputStyle'
                    {...register("confirmPassword", {
                        required: "Confirm Password is required!",
                        validate: (val) => {
                            const { newPassword } = getValues();

                            return newPassword === val || "Passwords does not match!"
                        }
                    })}

                    error={
                        errors.confirmPassword ? errors.confirmPassword.message : ""
                    }
                />
            </div>
            <div className='flex items-center gap-6 justify-end pb-10 border-b-2 border-gary-200 dark:border-gray-800 mt-10'>
                <Button
                    variant='outline'
                    loading={loading}
                    type='reset'
                    className='px-6 bg-transparent-400 text-black dark:text-white border border-gray-300 dark:border-gray-700 dark:bg-black'
                >
                    Reset
                </Button>

                <Button
                    loading={loading}
                    type='submit'
                    className='px-8 bg-violet-800 text-white'
                >
                    {loading ? <BiLoader className='animate-spin text-white' /> : "Change Password"}
                </Button>

            </div>
        </form>
    </div>
}