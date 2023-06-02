import { PrismaClient } from "@prisma/client";
import { convertData } from "./convertData";

export const seedingProcedure = async () => {
  console.log("delete procedure");

  const prisma = new PrismaClient();
  await prisma.procedure_options.deleteMany({});
  await prisma.procedure_steps.deleteMany({});
  await prisma.templates.deleteMany({});
  await prisma.procedures.deleteMany({});

  const procedureData = [
    {
      id: "1",
      key: "BC",
      id_field: "4",
      name: "Cấp giấy phép xuất bản bản tin",
      thanh_phan_ho_so: "Tờ khai đề nghị cấp giấy phép xuất bản bản tin",
      cach_thuc_thuc_hien:
        "Bản sao có chứng thực hoặc bản sao kèm bản chính để đối chiếu quyết định thành lập",
      doi_tuong_thuc_hien: "giấy phép thành lập",
      trinh_tu_thuc_hien:
        "giấy chứng nhận đăng ký doanh nghiệp hoặc giấy tờ khác có giá trị pháp lý tương đương (đối với tổ chức nước ngoài tại Việt Nam)",
      thoi_han_giai_quyet:
        "Sơ yếu lý lịch của người chịu trách nhiệm xuất bản bản tin",
      le_phi:
        "Mẫu trình bày tên gọi của bản tin và bản dịch tiếng Việt được công chứng (đối với tên gọi bản tin thể hiện bằng tiếng nước ngoài)",
      so_luong_ho_so: "",
      yeu_cau_dieu_kien: "",
      can_cu_phap_ly: "",
      ket_qua_thuc_hien: "",
      level: "",
    },
    {
      id: "2",
      key: "BCH",
      id_field: "5",
      name: "Cho phép họp báo (trong nước)",
      thanh_phan_ho_so: "Văn bản thông báo họp báo",
      cach_thuc_thuc_hien: "",
      doi_tuong_thuc_hien: "",
      trinh_tu_thuc_hien: "",
      thoi_han_giai_quyet: "",
      le_phi: "",
      so_luong_ho_so: "1",
      yeu_cau_dieu_kien: "",
      can_cu_phap_ly: "",
      ket_qua_thuc_hien: "Văn bản chấp thuận",
      level: "4",
    },
    {
      id: "3",
      key: "PTTT",
      id_field: "6",
      name: "Cấp giấy phép xuất bản bản tin",
      thanh_phan_ho_so: "Tờ khai đề nghị cấp giấy phép xuất bản bản tin",
      cach_thuc_thuc_hien:
        "Bản sao có chứng thực hoặc bản sao kèm bản chính để đối chiếu quyết định thành lập",
      doi_tuong_thuc_hien: "giấy phép thành lập",
      trinh_tu_thuc_hien:
        "giấy chứng nhận đăng ký doanh nghiệp hoặc giấy tờ khác có giá trị pháp lý tương đương (đối với tổ chức nước ngoài tại Việt Nam)",
      thoi_han_giai_quyet:
        "Sơ yếu lý lịch của người chịu trách nhiệm xuất bản bản tin",
      le_phi:
        "Mẫu trình bày tên gọi của bản tin và bản dịch tiếng Việt được công chứng (đối với tên gọi bản tin thể hiện bằng tiếng nước ngoài)",
      so_luong_ho_so: "",
      yeu_cau_dieu_kien: "",
      can_cu_phap_ly: "",
      ket_qua_thuc_hien: "",
      level: "",
    },
    {
      id: "4",
      key: "XB",
      id_field: "7",
      name: "Cho phép họp báo (trong nước)",
      thanh_phan_ho_so: "Văn bản thông báo họp báo",
      cach_thuc_thuc_hien: "",
      doi_tuong_thuc_hien: "",
      trinh_tu_thuc_hien: "",
      thoi_han_giai_quyet: "",
      le_phi: "",
      so_luong_ho_so: "1",
      yeu_cau_dieu_kien: "",
      can_cu_phap_ly: "",
      ket_qua_thuc_hien: "Văn bản chấp thuận",
      level: "4",
    },
    {
      id: "5",
      key: "HTDN",
      id_field: "8",
      name: "Cấp giấy phép xuất bản bản tin",
      thanh_phan_ho_so: "Tờ khai đề nghị cấp giấy phép xuất bản bản tin",
      cach_thuc_thuc_hien:
        "Bản sao có chứng thực hoặc bản sao kèm bản chính để đối chiếu quyết định thành lập",
      doi_tuong_thuc_hien: "giấy phép thành lập",
      trinh_tu_thuc_hien:
        "giấy chứng nhận đăng ký doanh nghiệp hoặc giấy tờ khác có giá trị pháp lý tương đương (đối với tổ chức nước ngoài tại Việt Nam)",
      thoi_han_giai_quyet:
        "Sơ yếu lý lịch của người chịu trách nhiệm xuất bản bản tin",
      le_phi:
        "Mẫu trình bày tên gọi của bản tin và bản dịch tiếng Việt được công chứng (đối với tên gọi bản tin thể hiện bằng tiếng nước ngoài)",
      so_luong_ho_so: "",
      yeu_cau_dieu_kien: "",
      can_cu_phap_ly: "",
      ket_qua_thuc_hien: "",
      level: "",
    },
    {
      id: "6",
      key: "LHHTX",
      id_field: "9",
      name: "Cho phép họp báo (trong nước)",
      thanh_phan_ho_so: "Văn bản thông báo họp báo",
      cach_thuc_thuc_hien: "",
      doi_tuong_thuc_hien: "",
      trinh_tu_thuc_hien: "",
      thoi_han_giai_quyet: "",
      le_phi: "",
      so_luong_ho_so: "1",
      yeu_cau_dieu_kien: "",
      can_cu_phap_ly: "",
      ket_qua_thuc_hien: "Văn bản chấp thuận",
      level: "4",
    },
    {
      id: "7",
      key: "HDDNXH",
      id_field: "10",
      name: "Cấp giấy phép xuất bản bản tin",
      thanh_phan_ho_so: "Tờ khai đề nghị cấp giấy phép xuất bản bản tin",
      cach_thuc_thuc_hien:
        "Bản sao có chứng thực hoặc bản sao kèm bản chính để đối chiếu quyết định thành lập",
      doi_tuong_thuc_hien: "giấy phép thành lập",
      trinh_tu_thuc_hien:
        "giấy chứng nhận đăng ký doanh nghiệp hoặc giấy tờ khác có giá trị pháp lý tương đương (đối với tổ chức nước ngoài tại Việt Nam)",
      thoi_han_giai_quyet:
        "Sơ yếu lý lịch của người chịu trách nhiệm xuất bản bản tin",
      le_phi:
        "Mẫu trình bày tên gọi của bản tin và bản dịch tiếng Việt được công chứng (đối với tên gọi bản tin thể hiện bằng tiếng nước ngoài)",
      so_luong_ho_so: "",
      yeu_cau_dieu_kien: "",
      can_cu_phap_ly: "",
      ket_qua_thuc_hien: "",
      level: "",
    },
    {
      id: "8",
      key: "XNC",
      id_field: "11",
      name: "Cho phép họp báo (trong nước)",
      thanh_phan_ho_so: "Văn bản thông báo họp báo",
      cach_thuc_thuc_hien: "",
      doi_tuong_thuc_hien: "",
      trinh_tu_thuc_hien: "",
      thoi_han_giai_quyet: "",
      le_phi: "",
      so_luong_ho_so: "1",
      yeu_cau_dieu_kien: "",
      can_cu_phap_ly: "",
      ket_qua_thuc_hien: "Văn bản chấp thuận",
      level: "4",
    },
    {
      id: "9",
      key: "DKDN",
      id_field: "12",
      name: "Cấp giấy phép xuất bản bản tin",
      thanh_phan_ho_so: "Tờ khai đề nghị cấp giấy phép xuất bản bản tin",
      cach_thuc_thuc_hien:
        "Bản sao có chứng thực hoặc bản sao kèm bản chính để đối chiếu quyết định thành lập",
      doi_tuong_thuc_hien: "giấy phép thành lập",
      trinh_tu_thuc_hien:
        "giấy chứng nhận đăng ký doanh nghiệp hoặc giấy tờ khác có giá trị pháp lý tương đương (đối với tổ chức nước ngoài tại Việt Nam)",
      thoi_han_giai_quyet:
        "Sơ yếu lý lịch của người chịu trách nhiệm xuất bản bản tin",
      le_phi:
        "Mẫu trình bày tên gọi của bản tin và bản dịch tiếng Việt được công chứng (đối với tên gọi bản tin thể hiện bằng tiếng nước ngoài)",
      so_luong_ho_so: "",
      yeu_cau_dieu_kien: "",
      can_cu_phap_ly: "",
      ket_qua_thuc_hien: "",
      level: "",
    },
    {
      id: "10",
      key: "DTH",
      id_field: "13",
      name: "Cho phép họp báo (trong nước)",
      thanh_phan_ho_so: "Văn bản thông báo họp báo",
      cach_thuc_thuc_hien: "",
      doi_tuong_thuc_hien: "",
      trinh_tu_thuc_hien: "",
      thoi_han_giai_quyet: "",
      le_phi: "",
      so_luong_ho_so: "1",
      yeu_cau_dieu_kien: "",
      can_cu_phap_ly: "",
      ket_qua_thuc_hien: "Văn bản chấp thuận",
      level: "4",
    },
    {
      id: "11",
      key: "DTVN",
      id_field: "14",
      name: "Cấp giấy phép xuất bản bản tin",
      thanh_phan_ho_so: "Tờ khai đề nghị cấp giấy phép xuất bản bản tin",
      cach_thuc_thuc_hien:
        "Bản sao có chứng thực hoặc bản sao kèm bản chính để đối chiếu quyết định thành lập",
      doi_tuong_thuc_hien: "giấy phép thành lập",
      trinh_tu_thuc_hien:
        "giấy chứng nhận đăng ký doanh nghiệp hoặc giấy tờ khác có giá trị pháp lý tương đương (đối với tổ chức nước ngoài tại Việt Nam)",
      thoi_han_giai_quyet:
        "Sơ yếu lý lịch của người chịu trách nhiệm xuất bản bản tin",
      le_phi:
        "Mẫu trình bày tên gọi của bản tin và bản dịch tiếng Việt được công chứng (đối với tên gọi bản tin thể hiện bằng tiếng nước ngoài)",
      so_luong_ho_so: "",
      yeu_cau_dieu_kien: "",
      can_cu_phap_ly: "",
      ket_qua_thuc_hien: "",
      level: "",
    },
    {
      id: "12",
      key: "DTNNNT",
      id_field: "15",
      name: "Cho phép họp báo (trong nước)",
      thanh_phan_ho_so: "Văn bản thông báo họp báo",
      cach_thuc_thuc_hien: "",
      doi_tuong_thuc_hien: "",
      trinh_tu_thuc_hien: "",
      thoi_han_giai_quyet: "",
      le_phi: "",
      so_luong_ho_so: "1",
      yeu_cau_dieu_kien: "",
      can_cu_phap_ly: "",
      ket_qua_thuc_hien: "Văn bản chấp thuận",
      level: "4",
    },
    {
      id: "13",
      key: "ATVSTP",
      id_field: "16",
      name: "Cấp giấy phép xuất bản bản tin",
      thanh_phan_ho_so: "Tờ khai đề nghị cấp giấy phép xuất bản bản tin",
      cach_thuc_thuc_hien:
        "Bản sao có chứng thực hoặc bản sao kèm bản chính để đối chiếu quyết định thành lập",
      doi_tuong_thuc_hien: "giấy phép thành lập",
      trinh_tu_thuc_hien:
        "giấy chứng nhận đăng ký doanh nghiệp hoặc giấy tờ khác có giá trị pháp lý tương đương (đối với tổ chức nước ngoài tại Việt Nam)",
      thoi_han_giai_quyet:
        "Sơ yếu lý lịch của người chịu trách nhiệm xuất bản bản tin",
      le_phi:
        "Mẫu trình bày tên gọi của bản tin và bản dịch tiếng Việt được công chứng (đối với tên gọi bản tin thể hiện bằng tiếng nước ngoài)",
      so_luong_ho_so: "",
      yeu_cau_dieu_kien: "",
      can_cu_phap_ly: "",
      ket_qua_thuc_hien: "",
      level: "",
    },
    {
      id: "14",
      key: "D_MP",
      id_field: "17",
      name: "Cho phép họp báo (trong nước)",
      thanh_phan_ho_so: "Văn bản thông báo họp báo",
      cach_thuc_thuc_hien: "",
      doi_tuong_thuc_hien: "",
      trinh_tu_thuc_hien: "",
      thoi_han_giai_quyet: "",
      le_phi: "",
      so_luong_ho_so: "1",
      yeu_cau_dieu_kien: "",
      can_cu_phap_ly: "",
      ket_qua_thuc_hien: "Văn bản chấp thuận",
      level: "4",
    },
    {
      id: "15",
      key: "K_CB",
      id_field: "18",
      name: "Cấp giấy phép xuất bản bản tin",
      thanh_phan_ho_so: "Tờ khai đề nghị cấp giấy phép xuất bản bản tin",
      cach_thuc_thuc_hien:
        "Bản sao có chứng thực hoặc bản sao kèm bản chính để đối chiếu quyết định thành lập",
      doi_tuong_thuc_hien: "giấy phép thành lập",
      trinh_tu_thuc_hien:
        "giấy chứng nhận đăng ký doanh nghiệp hoặc giấy tờ khác có giá trị pháp lý tương đương (đối với tổ chức nước ngoài tại Việt Nam)",
      thoi_han_giai_quyet:
        "Sơ yếu lý lịch của người chịu trách nhiệm xuất bản bản tin",
      le_phi:
        "Mẫu trình bày tên gọi của bản tin và bản dịch tiếng Việt được công chứng (đối với tên gọi bản tin thể hiện bằng tiếng nước ngoài)",
      so_luong_ho_so: "",
      yeu_cau_dieu_kien: "",
      can_cu_phap_ly: "",
      ket_qua_thuc_hien: "",
      level: "",
    },
    {
      id: "16",
      key: "TBYT",
      id_field: "19",
      name: "Cho phép họp báo (trong nước)",
      thanh_phan_ho_so: "Văn bản thông báo họp báo",
      cach_thuc_thuc_hien: "",
      doi_tuong_thuc_hien: "",
      trinh_tu_thuc_hien: "",
      thoi_han_giai_quyet: "",
      le_phi: "",
      so_luong_ho_so: "1",
      yeu_cau_dieu_kien: "",
      can_cu_phap_ly: "",
      ket_qua_thuc_hien: "Văn bản chấp thuận",
      level: "4",
    },
    {
      id: "17",
      key: "YTDP",
      id_field: "20",
      name: "Cấp giấy phép xuất bản bản tin",
      thanh_phan_ho_so: "Tờ khai đề nghị cấp giấy phép xuất bản bản tin",
      cach_thuc_thuc_hien:
        "Bản sao có chứng thực hoặc bản sao kèm bản chính để đối chiếu quyết định thành lập",
      doi_tuong_thuc_hien: "giấy phép thành lập",
      trinh_tu_thuc_hien:
        "giấy chứng nhận đăng ký doanh nghiệp hoặc giấy tờ khác có giá trị pháp lý tương đương (đối với tổ chức nước ngoài tại Việt Nam)",
      thoi_han_giai_quyet:
        "Sơ yếu lý lịch của người chịu trách nhiệm xuất bản bản tin",
      le_phi:
        "Mẫu trình bày tên gọi của bản tin và bản dịch tiếng Việt được công chứng (đối với tên gọi bản tin thể hiện bằng tiếng nước ngoài)",
      so_luong_ho_so: "",
      yeu_cau_dieu_kien: "",
      can_cu_phap_ly: "",
      ket_qua_thuc_hien: "",
      level: "",
    },
    {
      id: "18",
      key: "DK",
      id_field: "21",
      name: "Cho phép họp báo (trong nước)",
      thanh_phan_ho_so: "Văn bản thông báo họp báo",
      cach_thuc_thuc_hien: "",
      doi_tuong_thuc_hien: "",
      trinh_tu_thuc_hien: "",
      thoi_han_giai_quyet: "",
      le_phi: "",
      so_luong_ho_so: "1",
      yeu_cau_dieu_kien: "",
      can_cu_phap_ly: "",
      ket_qua_thuc_hien: "Văn bản chấp thuận",
      level: "4",
    },
  ];
  const procedureSeedingData = convertData(
    procedureData,
    "id_field",
    "level",
    "so_luong_ho_so",
  );

  await prisma.procedures.createMany({ data: procedureSeedingData });

  const template = [
    {
      id: "1",
      name: "Mặc định (Lý do nộp)",
      data: "[]",
    },
    {
      id: "2",
      name: "Mặc định (Lý do nộp)",
      data: "[]",
    },
  ];

  const templateSeeding = convertData(template);
  await prisma.templates.createMany({ data: templateSeeding });

  const procedure_options = [
    {
      id: "1",
      id_procedure: "3",
      id_template: "2",
      name: "30 ngày - QT nội bộ",
      processing_time: "720",
    },
    {
      id: "2",
      id_procedure: "4",
      id_template: "2",
      name: "Xử lý trong 1 ngày",
      processing_time: "24",
    },
  ];

  const procedure_options_seeding = convertData(
    procedure_options,
    "id_procedure",
    "id_template",
    "processing_time",
  );
  await prisma.procedure_options.createMany({
    data: procedure_options_seeding,
  });

  const procedure_steps = [
    {
      id: "1",
      id_option: "1",
      id_group: "1",
      name: "Tiếp nhận hồ sơ",
      note: "Tất cả cán bộ của bộ phận tiếp nhận Sở thông tin và Truyền thông được quyền xử lý bước này",
      order: "0",
      id_procedure: "1",
    },
    {
      id: "2",
      id_option: "2",
      id_group: "1",
      name: "Tiếp nhận hồ sơ",
      note: "",
      order: "0",
      id_procedure: "1",
    },
    {
      id: "3",
      id_option: "2",
      id_group: "2",
      name: "Xử lý thông tin công dân",
      note: "",
      order: "1",
      id_procedure: "1",
    },
    {
      id: "4",
      id_option: "2",
      id_group: "2",
      name: "Xử lý hồ sơ đính kèm",
      note: "",
      order: "1",
      id_procedure: "1",
    },
    {
      id: "5",
      id_option: "2",
      id_group: "3",
      name: "Trả kết quả",
      note: "",
      order: "1",
      id_procedure: "1",
    },
    {
      id: "6",
      id_option: "2",
      id_group: "1",
      name: "Tiếp nhận",
      note: "",
      order: "0",
      id_procedure: "1",
    },
    {
      id: "7",
      id_option: "1",
      id_group: "2",
      name: "Xử lý hồ sơ",
      note: "",
      order: "0",
      id_procedure: "1",
    },
    {
      id: "8",
      id_option: "1",
      id_group: "3",
      name: "Trả kết quả",
      note: "",
      order: "0",
      id_procedure: "1",
    },
  ];

  const procedure_steps_seeding = convertData(
    procedure_steps,
    "id_option",
    "id_group",
    "order",
    "id_procedure",
  );
  await prisma.procedure_steps.createMany({ data: procedure_steps_seeding });
  
};
