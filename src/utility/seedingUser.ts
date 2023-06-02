import { PrismaClient } from "@prisma/client";

export const seedingUser = async () => {
  const prisma = new PrismaClient();
  await prisma.info_user.deleteMany({});
  await prisma.users.deleteMany({});
  const users = [
    {
      id: 1,
      email: "quantrivien1@gmail.com",
      password: "$2b$10$XeA9CvQPXRvjjgxv4hF/3.Attr4CzpTWl/sCYYHB7IE7OKNBQFC5q",
      full_name: "Quản trị viên 1",
      organization: "",
      date_of_birth: "2023-05-30T00:25:38.000Z",
      identity_card: "91087530151",
      identity_card_date: "2023-05-30T00:25:38.000Z",
      identity_card_address: "Công an huyện Hải Hà",
      phone_number: "0966944301",
      fax: "",
      website: "",
      ward: "1",
      address: "Phường Phúc Xá, Quận Ba Đình, Thành phố Hà Nội",
      role: 2,
      remember_token: null,
      id_organization: null,
      isTrash: false,
    },
  ];

  await prisma.users.createMany({ data: users });

  const info_user = [
    {
      id: 1,
      full_name: "Quản trị viên 1",
      phone_number: "0966944301",
      email: "quantrivien1@gmail.com",
      organization: "",
      identity_card: "91087530151",
      identity_card_date: "2023-05-30T00:25:38.000Z",
      identity_card_address: "Công an huyện Hải Hà",
      fax: "",
      website: "",
      ward: "1",
      address: "Phường Phúc Xá, Quận Ba Đình, Thành phố Hà Nội",
      id_organization: null,
      id_user: 1,
      isTrash: false,
    },
  ];

  await prisma.info_user.createMany({ data: info_user });
};
