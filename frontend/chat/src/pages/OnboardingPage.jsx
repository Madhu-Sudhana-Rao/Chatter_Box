import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import {
  LoaderIcon,
  MapPinIcon,
  ShipWheelIcon,
  ShuffleIcon,
  CameraIcon,
} from "lucide-react";
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
  const { authUser, isLoading } = useAuthUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    fullName: "",
    bio: "",
    nativeLanguage: "",
    learningLanguage: "",
    location: "",
    profilePic: "",
  });

  useEffect(() => {
    if (authUser) {
      setFormState({
        fullName: authUser.fullName || "",
        bio: authUser.bio || "",
        nativeLanguage: authUser.nativeLanguage || "",
        learningLanguage: authUser.learningLanguage || "",
        location: authUser.location || "",
        profilePic: authUser.profilePic || "",
      });
    }
  }, [authUser]);

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Onboarding completed!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Onboarding failed. Try again."
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      formState;

    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      toast.error("Please fill in all the fields.");
      return;
    }

    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random avatar generated!");
  };

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  if (isLoading) return <div className="text-center">Loading...</div>;

  return (
    <div
      className="min-h-screen bg-base-200 flex items-center justify-center px-4"
      data-theme="dracula"
    >
      <div className="card bg-base-100 w-full max-w-md shadow-lg">
        <div className="card-body p-6">
          <h1 className="text-2xl font-bold text-center mb-4">
            Complete Your Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-3">
              <div className="size-24 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-10 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleRandomAvatar}
                className="btn btn-accent btn-sm"
              >
                <ShuffleIcon className="size-4 mr-2" />
                Random Avatar
              </button>
            </div>

            {/* Full Name */}
            <div className="form-control">
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="Full Name"
              />
            </div>

            {/* Bio */}
            <div className="form-control">
              <textarea
                name="bio"
                value={formState.bio}
                onChange={handleInputChange}
                className="textarea textarea-bordered h-20"
                placeholder="Your bio"
              />
            </div>

            {/* Languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="form-control">
                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                >
                  <option value="">Native Language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <select
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                >
                  <option value="">Learning Language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="form-control relative">
              <MapPinIcon className="absolute top-1/2 left-3 -translate-y-1/2 size-4 text-base-content opacity-70" />
              <input
                type="text"
                name="location"
                value={formState.location}
                onChange={handleInputChange}
                className="input input-bordered w-full pl-10"
                placeholder="Location"
              />
            </div>

            {/* Submit */}
            <button
              className="btn btn-primary w-full"
              disabled={isPending}
              type="submit"
            >
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-4 mr-2" />
                  Complete
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-4 mr-2" />
                  Loading...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
