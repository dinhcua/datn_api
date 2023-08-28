"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../abstractions/base");
const nodemailer_1 = __importDefault(require("nodemailer"));
class adminFilesController extends base_1.BaseController {
    constructor() {
        super();
        this.path = "/api/admin/files";
        this.getAllFiles = async (request, response, next) => {
            const req = request.query;
            //{ id_group: '2', id_user: '3', page: '1', perPage: '10', q: '' }
            // console.log(request);
            if (typeof req.id_group === "string") {
                // console.log("id_group", req.id_group);
                const id_group = Number.parseInt(req.id_group);
                // const procedure_steps = await this.prisma.procedure_steps.findMany({
                //   where: { id_group },
                // });
                // const step_ids = procedure_steps.map((step) => step.id);
                const where = typeof req.status === "string"
                    ? { id_option: id_group, status: Number.parseInt(req.status) }
                    : { id_option: id_group, OR: [{ status: 0 }, { status: 1 }] };
                const files = await this.prisma.files.findMany({
                    where,
                });
                const data = await Promise.all(files.map(async (file) => {
                    const user_info = await this.prisma.info_user.findUnique({
                        where: {
                            id: file.id_info_user,
                        },
                    });
                    const step = await this.prisma.procedure_steps.findUnique({
                        where: {
                            id: file.id_step,
                        },
                    });
                    return { ...file, user_info, step };
                }));
                response.json({ data });
            }
        };
        this.getFileById = async (request, response, next) => {
            const id_file = Number.parseInt(request.params.id);
            const file = await this.prisma.files.findUnique({
                where: {
                    id: id_file,
                },
            });
            const procedure = await this.prisma.procedures.findUnique({
                where: {
                    id: file === null || file === void 0 ? void 0 : file.id_procedure,
                },
            });
            const user_info = await this.prisma.info_user.findUnique({
                where: {
                    id: file === null || file === void 0 ? void 0 : file.id_info_user,
                },
            });
            if (file === null || file === void 0 ? void 0 : file.access_key) {
                const files = await this.prisma.file_storage.findMany({
                    where: { category: file.access_key },
                });
                const data = { ...file, procedure, user_info, files };
                response.json({ data });
            }
            else {
                const data = { ...file, procedure, user_info, files: [] };
                response.json({ data });
            }
        };
        this.handleNextStep = async (request, response, next) => {
            const reqBody = request.body;
            const id_file = Number.parseInt(reqBody.id_file);
            const current_file = await this.prisma.files.findUnique({
                where: {
                    id: id_file,
                },
            });
            const current_procedure = await this.prisma.procedures.findUnique({
                where: {
                    id: current_file === null || current_file === void 0 ? void 0 : current_file.id_procedure,
                },
            });
            if (!current_file)
                return;
            if (!current_procedure)
                return;
            //example
            const procedureSteps = await this.prisma.procedure_steps.findMany({
                where: {
                    id_procedure: current_file.id_procedure,
                },
            });
            const totalProcedureSteps = procedureSteps.length;
            const current_step = procedureSteps.find((step) => step.id === current_file.id_step);
            const isFinish = (current_step === null || current_step === void 0 ? void 0 : current_step.order) === totalProcedureSteps;
            if (isFinish) {
                const transporter = nodemailer_1.default.createTransport({
                    // config mail server
                    service: "Gmail",
                    auth: {
                        user: "luongdinhcua2512@gmail.com",
                        pass: "Aa0966944309",
                    },
                });
                const mailOptions = {
                    from: "luongdinhcua2512@gmail.com",
                    to: "ldcua2512@gmail.com",
                    subject: "Test Email",
                    text: "Hello, this is a test email sent from Nodemailer with TypeScript!",
                };
                try {
                    // Gửi email
                    const info = await transporter.sendMail(mailOptions);
                    console.log("Email sent:", info.response);
                }
                catch (error) {
                    console.error("Error sending email:", error);
                }
            }
            // if (isFinish) {
            //   const thanh_phan_ho_so_docx = [current_procedure.thanh_phan_ho_so].map(
            //     (thanh_phan: any, index: number) =>
            //       new Paragraph({
            //         children: [
            //           new TextRun({
            //             text: `${index + 1}. ${thanh_phan.toLowerCase()}: ${
            //               current_file.data_template
            //                 ? current_file.data_template[index]
            //                 : ""
            //             }`,
            //           }),
            //         ],
            //       }),
            //   );
            //   const date = new Date(reqBody.file.file_create_day);
            //   const day = date.getDate(); // Get the day (1-31)
            //   const month = date.getMonth() + 1; // Get the month (0-11, adding 1 to match the standard 1-12)
            //   const year = date.getFullYear(); // Get the four-digit year
            //   const doc = new Document({
            //     sections: [
            //       {
            //         properties: {},
            //         children: [
            //           new Paragraph({
            //             children: [
            //               new TextRun({
            //                 text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
            //                 bold: true,
            //               }),
            //             ],
            //             alignment: AlignmentType.CENTER,
            //           }),
            //           new Paragraph({
            //             children: [
            //               new TextRun({
            //                 text: "Độc lập - Tự do - Hạnh phúc",
            //                 bold: true,
            //               }),
            //             ],
            //             alignment: AlignmentType.CENTER,
            //           }),
            //           new Paragraph({
            //             children: [
            //               new TextRun({
            //                 text: `Quảng Ninh, ngày ${day}  tháng ${month} năm ${year}.`,
            //               }),
            //             ],
            //             alignment: AlignmentType.RIGHT,
            //           }),
            //           new Paragraph({
            //             children: [
            //               new TextRun({
            //                 text: `${reqBody.procedure.name}`,
            //               }),
            //             ],
            //             alignment: AlignmentType.CENTER,
            //           }),
            //           new Paragraph({
            //             children: [
            //               new TextRun({
            //                 text: "-----------------------------------",
            //               }),
            //             ],
            //             alignment: AlignmentType.CENTER,
            //           }),
            //           new Paragraph({
            //             children: [
            //               new TextRun({
            //                 text: `Kính gửi: ${reqBody.procedure.first_organization.name}`,
            //                 bold: true,
            //               }),
            //             ],
            //             alignment: AlignmentType.CENTER,
            //           }),
            //           new Paragraph({
            //             children: [
            //               new TextRun({
            //                 text: `${reqBody.procedure.field.name}`,
            //                 bold: true,
            //               }),
            //             ],
            //             alignment: AlignmentType.CENTER,
            //           }),
            //           new Paragraph({
            //             children: [
            //               new TextRun({
            //                 text: "",
            //               }),
            //             ],
            //           }),
            //           new Paragraph({
            //             children: [
            //               new TextRun({
            //                 text: `- Tên cơ quan, tổ chức, đơn vị : ${reqBody.user.full_name}..........................`,
            //               }),
            //             ],
            //           }),
            //           new Paragraph({
            //             children: [
            //               new TextRun({
            //                 text: `- Địa chỉ: ${reqBody.user.address}...... Số điện thoại: ${reqBody.user.phone_number}......`,
            //               }),
            //             ],
            //           }),
            //           new Paragraph({
            //             children: [
            //               new TextRun({
            //                 text: `- Số Fax/Email: ${reqBody.user.email} ................................................................`,
            //               }),
            //             ],
            //           }),
            //           new Paragraph({
            //             children: [
            //               new TextRun({
            //                 text: "",
            //               }),
            //             ],
            //           }),
            //           new Paragraph({
            //             children: [
            //               new TextRun({
            //                 text: `${reqBody.procedure.name} với các thông tin như sau:`,
            //               }),
            //             ],
            //           }),
            //           ...thanh_phan_ho_so_docx,
            //           new Paragraph({
            //             children: [
            //               new TextRun({
            //                 text: "",
            //               }),
            //             ],
            //           }),
            //           new Paragraph({
            //             children: [
            //               new TextRun({
            //                 text: `${reqBody.procedure.note}`,
            //               }),
            //             ],
            //           }),
            //           new Paragraph({
            //             children: [
            //               new TextRun({
            //                 text: "",
            //               }),
            //             ],
            //           }),
            //           new Paragraph({
            //             children: [
            //               new TextRun({
            //                 text: "Người đứng đầu cơ quan, tổ chức, đơn vị",
            //                 bold: true,
            //               }),
            //             ],
            //             alignment: AlignmentType.RIGHT,
            //           }),
            //           new Paragraph({
            //             children: [
            //               new TextRun({
            //                 text: "(ký, đóng dấu, ghi rõ họ tên)",
            //               }),
            //             ],
            //             alignment: AlignmentType.RIGHT,
            //           }),
            //           new Paragraph({
            //             children: [
            //               new ImageRun({
            //                 data: fs.readFileSync("passed.png"),
            //                 transformation: {
            //                   width: 150,
            //                   height: 150,
            //                 },
            //               }),
            //             ],
            //             alignment: AlignmentType.RIGHT,
            //           }),
            //         ],
            //       },
            //     ],
            //   });
            //   const outputPath = `uploads/${current_file.id_user}/${current_file.id}/${current_procedure.name}.docx`;
            //   Packer.toBuffer(doc).then((buffer) => {
            //     fs.writeFileSync(outputPath, buffer);
            //     console.log("Document generated successfully!");
            //   });
            // }
            if (current_step === null || current_step === void 0 ? void 0 : current_step.order) {
                const nextStep = procedureSteps.find((step) => step.order === current_step.order + 1);
                // console.log("nextStep", nextStep);
                const file = await this.prisma.files.update({
                    where: {
                        id: id_file,
                    },
                    data: {
                        id_step: nextStep === null || nextStep === void 0 ? void 0 : nextStep.id,
                        current_step: current_step.order + 1,
                        status: isFinish ? 2 : 1,
                        id_option: nextStep === null || nextStep === void 0 ? void 0 : nextStep.id_group,
                    },
                });
                if (file) {
                    response.json({ success: true });
                }
            }
        };
        this.handleCancel = async (request, response, next) => {
            const reqBody = request.body;
            const id_file = Number.parseInt(reqBody.id_file);
            const file = await this.prisma.files.update({
                where: {
                    id: id_file,
                },
                data: {
                    status: 3,
                },
            });
            if (file) {
                response.json({ success: true, message: "Huỷ hồ sơ thành công" });
            }
            else {
                response.json({ success: false, message: "Huỷ hồ sơ thất bại" });
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path + "/get", this.getAllFiles);
        this.router.get(this.path + "/get/:id", this.getFileById);
        this.router.post(this.path + "/next-step", this.handleNextStep);
        this.router.post(this.path + "/cancel", this.handleCancel);
    }
}
exports.default = adminFilesController;
