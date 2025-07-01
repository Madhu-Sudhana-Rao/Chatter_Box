import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";
import toast from "react-hot-toast";

const isSignup = () => {
    const queryClient = useQueryClient();

    const {
        mutate: signupMutation,
        isPending,
        error,
    } = useMutation({
        mutationFn: signup,
        onSuccess: () => {
            toast.success("Signup Successful!");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Signup failed!");
        },
    });

    return { signupMutation, isPending, error };
};

export default isSignup;
