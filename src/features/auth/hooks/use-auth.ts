import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { authService } from "../services/auth-services";
import { toast } from "sonner";
import { useEffect } from "react";
import supabase from "@/lib/supabase-client";

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      // Invalidate and refetch the currentUser query
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  const {
    data: user,
    isLoading: isFetchingUser,
    error: userError,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authService.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const signUpMutation = useMutation({
    mutationFn: authService.signUp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      navigate("/dashboard");
    },
    onError: (error) => {
      if (
        error.message.includes("already") ||
        error.message.includes("exists")
      ) {
        toast.error("Email sudah terdaftar, silakan gunakan email lain");
      } else {
        toast.error("Gagal mendaftar: " + error.message);
      }
    },
  });

  const signInMutation = useMutation({
    mutationFn: authService.signIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const signOutMutation = useMutation({
    mutationFn: authService.signOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      navigate("/sign-in");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    user,
    isFetchingUser,
    userError,
    signUp: signUpMutation.mutate,
    isSigningUp: signUpMutation.isPending,
    signIn: signInMutation.mutate,
    isSigningIn: signInMutation.isPending,
    signOut: signOutMutation.mutate,
  };
};
