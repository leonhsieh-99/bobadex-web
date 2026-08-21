export type ShowcaseAchievement = {
  name: string;
  description: string;
  image: string;
};

export const catalogAchievements: ShowcaseAchievement[] = [
  {
    name: "Boba Explorer I",
    description: "Visit 5 unique shops.",
    image: "/badges/boba_explorer_1.png",
  },
  {
    name: "Boba Explorer II",
    description: "Visit 15 unique shops.",
    image: "/badges/boba_explorer_2.png",
  },
  {
    name: "Boba Explorer III",
    description: "Visit 30 unique shops.",
    image: "/badges/boba_explorer_3.png",
  },
  {
    name: "Boba Explorer IV",
    description: "Visit 50 unique shops.",
    image: "/badges/boba_explorer_4.png",
  },
  {
    name: "Connoisseur",
    description: "Visit 100 unique shops.",
    image: "/badges/connoisseur.png",
  },
  {
    name: "Bobaholic I",
    description: "Try 10 different drinks.",
    image: "/badges/bobaholic_1.png",
  },
  {
    name: "Bobaholic II",
    description: "Try 25 different drinks.",
    image: "/badges/bobaholic_2.png",
  },
  {
    name: "Bobaholic III",
    description: "Try 50 different drinks.",
    image: "/badges/bobaholic_3.png",
  },
  {
    name: "Bobaholic IV",
    description: "Try 100 different drinks.",
    image: "/badges/bobaholic_4.png",
  },
  {
    name: "Big Back",
    description: "Try 200 different drinks.",
    image: "/badges/big_back.png",
  },
  {
    name: "Reviewer I",
    description: "Add notes to 5 drinks.",
    image: "/badges/reviewer_1.png",
  },
  {
    name: "Reviewer II",
    description: "Add notes to 15 drinks.",
    image: "/badges/reviewer_2.png",
  },
  {
    name: "Reviewer III",
    description: "Add notes to 30 drinks.",
    image: "/badges/reviewer_3.png",
  },
  {
    name: "Reviewer IV",
    description: "Add notes to 50 drinks.",
    image: "/badges/reviewer_4.png",
  },
  {
    name: "Yapper",
    description: "Add notes to 100 drinks.",
    image: "/badges/yapper.png",
  },
  {
    name: "Photographer I",
    description: "Upload 10 photos.",
    image: "/badges/photographer_1.png",
  },
  {
    name: "Photographer II",
    description: "Upload 25 photos.",
    image: "/badges/photographer_2.png",
  },
  {
    name: "Photographer III",
    description: "Upload 50 photos.",
    image: "/badges/photographer_3.png",
  },
  {
    name: "Photographer IV",
    description: "Upload 100 photos.",
    image: "/badges/photographer_4.png",
  },
  {
    name: "Clout Chaser",
    description: "Upload 200 photos.",
    image: "/badges/clout_chaser.png",
  },
  {
    name: "Social Sipper I",
    description: "Add 1 friend on Bobadex.",
    image: "/badges/social_sipper_1.png",
  },
  {
    name: "Social Sipper II",
    description: "Add 5 friends on Bobadex.",
    image: "/badges/social_sipper_2.png",
  },
  {
    name: "Social Sipper III",
    description: "Add 15 friends on Bobadex.",
    image: "/badges/social_sipper_3.png",
  },
  {
    name: "Social Sipper IV",
    description: "Add 50 friends on Bobadex.",
    image: "/badges/social_sipper_4.png",
  },
  {
    name: "Main Character",
    description: "Add 100 friends on Bobadex.",
    image: "/badges/main_character.png",
  },
  {
    name: "Talking Phase",
    description: "Try 5 drinks from a single shop.",
    image: "/badges/talking_phase.png",
  },
  {
    name: "Situationship",
    description: "Try 10 drinks from a single shop.",
    image: "/badges/situationship.png",
  },
  {
    name: "One and Only",
    description: "Try 15 drinks from a single shop.",
    image: "/badges/one_and_only.png",
  },
  {
    name: "TEA",
    description: "Collect every achievement.",
    image: "/badges/boba.png",
  },
];

export const teaserAchievements = catalogAchievements.filter((achievement) =>
  ["Boba Explorer I", "Bobaholic I", "Photographer I", "TEA"].includes(
    achievement.name,
  ),
);
