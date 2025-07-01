import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api";
import toast from "react-hot-toast";

const isLogin = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, error } = useMutation({
        mutationFn: login,
        onSuccess: () => {
            toast.success("Login successful!");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Login failed");
        },
    });

    return { error, isPending, loginMutation: mutate };
};

export default isLogin;
