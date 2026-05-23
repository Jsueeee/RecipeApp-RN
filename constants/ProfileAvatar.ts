import type { ImageSourcePropType } from "react-native";

type ProfileAvatar = {
  url: string;
  source: ImageSourcePropType;
};

export const PROFILE_AVATARS = [
  {
    url: "https://firebasestorage.googleapis.com/v0/b/recipeapp-a79ed.appspot.com/o/profile_icon%2Favatar.png?alt=media&token=d29802a8-9c30-41f1-ab04-5ccf62c3dad4",
    source: require("@/assets/images/profile/avatar_0.png"),
  },
  {
    url: "https://firebasestorage.googleapis.com/v0/b/recipeapp-a79ed.appspot.com/o/profile_icon%2Favatar%20(1).png?alt=media&token=4eec78f8-597b-40af-8a8f-436ee80d60d6",
    source: require("@/assets/images/profile/avatar_1.png"),
  },
  {
    url: "https://firebasestorage.googleapis.com/v0/b/recipeapp-a79ed.appspot.com/o/profile_icon%2Favatar%20(2).png?alt=media&token=b91f794c-1f83-4910-b146-29a1343906a3",
    source: require("@/assets/images/profile/avatar_2.png"),
  },
  {
    url: "https://firebasestorage.googleapis.com/v0/b/recipeapp-a79ed.appspot.com/o/profile_icon%2Favatar%20(3).png?alt=media&token=9ccba668-6eef-4fa7-8c8d-396aa251d12f",
    source: require("@/assets/images/profile/avatar_3.png"),
  },
  {
    url: "https://firebasestorage.googleapis.com/v0/b/recipeapp-a79ed.appspot.com/o/profile_icon%2Favatar%20(4).png?alt=media&token=18073140-e65d-46c0-a397-a65951ec075b",
    source: require("@/assets/images/profile/avatar_4.png"),
  },
  {
    url: "https://firebasestorage.googleapis.com/v0/b/recipeapp-a79ed.appspot.com/o/profile_icon%2Favatar%20(5).png?alt=media&token=71a5f924-3e8b-4549-be70-9b03246017b1",
    source: require("@/assets/images/profile/avatar_5.png"),
  },
  {
    url: "https://firebasestorage.googleapis.com/v0/b/recipeapp-a79ed.appspot.com/o/profile_icon%2Favatar%20(6).png?alt=media&token=6d51c5ce-d610-4a04-9729-976851bfeead",
    source: require("@/assets/images/profile/avatar_6.png"),
  },
  {
    url: "https://firebasestorage.googleapis.com/v0/b/recipeapp-a79ed.appspot.com/o/profile_icon%2Favatar%20(7).png?alt=media&token=27890682-4c8f-4749-98fd-d99b232ab0e3",
    source: require("@/assets/images/profile/avatar_7.png"),
  },
] satisfies ProfileAvatar[];

const PROFILE_AVATAR_SOURCE_BY_URL = new Map(
  PROFILE_AVATARS.map(({ url, source }) => [url, source] as const),
);

export const isProfileAvatarUrl = (url: string | null | undefined) =>
  Boolean(url && PROFILE_AVATAR_SOURCE_BY_URL.has(url));

export const getProfileAvatarSource = (
  url: string | null | undefined,
): ImageSourcePropType | undefined => {
  if (!url) return undefined;

  return (
    PROFILE_AVATAR_SOURCE_BY_URL.get(url) ?? {
      uri: url,
      cache: "force-cache",
    }
  );
};
