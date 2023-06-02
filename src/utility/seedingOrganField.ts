import { PrismaClient } from "@prisma/client";
import { convertData } from "./convertData";

export const seedingOrganField = async () => {
  const prisma = new PrismaClient();
  console.log("start organization and field");
  await prisma.organization_field.deleteMany({});
  await prisma.organizations.deleteMany({});
  await prisma.groups.deleteMany({});
  await prisma.fields.deleteMany({});

  const organizationsSeeding = [
    {
      id: "3",
      key: "SO_TTTT",
      name: "Sở Thông tin và Truyền thông",
    },
    {
      id: "4",
      key: "SO_KHDT",
      name: "Sở Kế hoạch và Đầu tư",
    },
    {
      id: "5",
      key: "SO_YTE",
      name: "Sở Y tế",
    },
    {
      id: "6",
      key: "SO_GTVT",
      name: "Sở Giao thông Vận tải",
    },
    {
      id: "7",
      key: "SO_NV",
      name: "Sở Nội vụ",
    },
    {
      id: "8",
      key: "SO_TC",
      name: "Sở Tài chính",
    },
    {
      id: "9",
      key: "SO_TNMT",
      name: "Sở Tài nguyên và Môi trường",
    },
    {
      id: "10",
      key: "SO_CTHUONG",
      name: "Sở Công thương",
    },
    {
      id: "11",
      key: "SO_GDDT",
      name: "Sở Giáo dục và Đào tạo",
    },
    {
      id: "12",
      key: "SO_KHCN",
      name: "Sở Khoa học và Công nghệ",
    },
    {
      id: "13",
      key: "SO_LDTBXH",
      name: "Sở Lao động - Thương binh - Xã hội",
    },
    {
      id: "14",
      key: "SO_NN",
      name: "Sở Nông nghiệp và Phát triển nông thôn",
    },
  ];

  const organizationsSeedingData = convertData(organizationsSeeding);
  await prisma.organizations.createMany({ data: organizationsSeedingData });

  const groupData = [
    {
      id: "1",
      id_organization: "3",
      name: "Bộ phận Tiếp nhận - Sở TT&TT",
      note: "",
    },
    {
      id: "2",
      id_organization: "3",
      name: "Bộ phận Xử lý hồ sơ - Sở TT&TT",
      note: "",
    },
    {
      id: "3",
      id_organization: "3",
      name: "Bộ phận Trả hồ sơ - Sở TT&TT",
      note: "",
    },
  ];

  const groupSeedingData = convertData(groupData, "id_organization");

  await prisma.groups.createMany({ data: groupSeedingData });

  const fieldsSeeding = [
    {
      id: "4",
      key: "BC",
      name: "Báo chí",
      description: "",
    },
    {
      id: "5",
      key: "BCH",
      name: "Bưu chính",
      description: "",
    },
    {
      id: "6",
      key: "PTTT",
      name: "Phát thanh Truyền hình và Thông tin điện tử",
      description: "",
    },
    {
      id: "7",
      key: "XB",
      name: "Xuất bản",
      description: "",
    },
    {
      id: "8",
      key: "HTDN",
      name: "Hỗ trợ doanh nghiệp nhỏ và vừa",
      description: "",
    },
    {
      id: "9",
      key: "LHHTX",
      name: "Liên hiệp Hợp tác xã",
      description: "",
    },
    {
      id: "10",
      key: "HDDNXH",
      name: "Thành lập và hoạt động doanh nghiệp xã hội",
      description: "",
    },
    {
      id: "11",
      key: "XNC",
      name: "Xuất nhập cảnh",
      description: "",
    },
    {
      id: "12",
      key: "DKDN",
      name: "Đăng ký doanh nghiệp",
      description: "",
    },
    {
      id: "13",
      key: "DTH",
      name: "Đấu thầu",
      description: "",
    },
    {
      id: "14",
      key: "DTVN",
      name: "Đầu tư tại Việt Nam",
      description: "",
    },
    {
      id: "15",
      key: "DTNNNT",
      name: "Đầu tư nông nghiệp & nông thôn",
      description: "",
    },
    {
      id: "16",
      key: "ATVSTP",
      name: "An toàn vệ sinh thực phẩm",
      description: "",
    },
    {
      id: "17",
      key: "D_MP",
      name: "Dược - Mỹ phẩm",
      description: "",
    },
    {
      id: "18",
      key: "K_CB",
      name: "Khám - Chữa bệnh",
      description: "",
    },
    {
      id: "19",
      key: "TBYT",
      name: "Trang thiết bị y tế",
      description: "",
    },
    {
      id: "20",
      key: "YTDP",
      name: "Y tế dự phòng",
      description: "",
    },
    {
      id: "21",
      key: "DK",
      name: "Đăng kiểm",
      description: "",
    },
    {
      id: "22",
      key: "DB",
      name: "Đường bộ",
      description: "",
    },
    {
      id: "23",
      key: "DTND",
      name: "Đường thủy nội địa",
      description: "",
    },
  ];

  const fieldsSeedingData = convertData(fieldsSeeding);

  await prisma.fields.createMany({ data: fieldsSeedingData });

  const orFieldSeeding = [
    {
      id: "13",
      id_organization: "5",
      id_field: "17",
    },
    {
      id: "14",
      id_organization: "5",
      id_field: "18",
    },
    {
      id: "15",
      id_organization: "5",
      id_field: "19",
    },
    {
      id: "19",
      id_organization: "5",
      id_field: "20",
    },
    {
      id: "20",
      id_organization: "3",
      id_field: "4",
    },
    {
      id: "21",
      id_organization: "3",
      id_field: "5",
    },
    {
      id: "22",
      id_organization: "3",
      id_field: "6",
    },
    {
      id: "23",
      id_organization: "3",
      id_field: "7",
    },
    {
      id: "24",
      id_organization: "4",
      id_field: "8",
    },
    {
      id: "25",
      id_organization: "4",
      id_field: "9",
    },
    {
      id: "26",
      id_organization: "4",
      id_field: "10",
    },
    {
      id: "27",
      id_organization: "4",
      id_field: "11",
    },
    {
      id: "28",
      id_organization: "4",
      id_field: "12",
    },
    {
      id: "29",
      id_organization: "4",
      id_field: "13",
    },
    {
      id: "30",
      id_organization: "4",
      id_field: "14",
    },
    {
      id: "31",
      id_organization: "4",
      id_field: "15",
    },
    {
      id: "32",
      id_organization: "5",
      id_field: "16",
    },
    {
      id: "33",
      id_organization: "6",
      id_field: "21",
    },
    {
      id: "34",
      id_organization: "6",
      id_field: "22",
    },
    {
      id: "35",
      id_organization: "6",
      id_field: "23",
    },
  ];

  const orFieldSeedingData = convertData(
    orFieldSeeding,
    "id_organization",
    "id_field",
  );

  await prisma.organization_field.createMany({ data: orFieldSeedingData });
  console.log("finish seeding organization and field");
};
