import { Request, Response } from "express";
import { SolicitudModel } from "../../models/solicitud";
import { TestimonioModel } from "../../models/testimonio";
import { NoticiaModel } from "../../models/noticia";

export class DashboardController {
  async getMetrics(req: Request, res: Response): Promise<Response> {
    try {
      const { rol, pais } = req.user!;
      console.log("ROL:", rol);
      console.log("PAIS TOKEN:", pais);

      if (rol === "superadmin") {
        // ── Superadmin: métricas globales agrupadas por país ──────────────
        console.log("ROL:", rol);
        console.log("PAIS TOKEN:", pais);
        const [solicitudesPendientes, testimoniosPublicados, noticiasActivas] =
          await Promise.all([
            // Agrupa solicitudes pendientes por país
            SolicitudModel.aggregate([
              { $match: { estado: "pendiente" } },
              { $group: { _id: "$pais", total: { $sum: 1 } } },
              {
                $lookup: {
                  from: "pais",
                  localField: "_id",
                  foreignField: "_id",
                  as: "pais_info",
                },
              },
              {
                $unwind: {
                  path: "$pais_info",
                  preserveNullAndEmptyArrays: true,
                },
              },
              { $project: { pais: "$pais_info.nombre", total: 1, _id: 0 } },
            ]),
            // Cuenta testimonios publicados por país
            TestimonioModel.aggregate([
              { $match: { estado: "publicado" } },
              { $group: { _id: "$pais", total: { $sum: 1 } } },
              {
                $lookup: {
                  from: "pais",
                  localField: "_id",
                  foreignField: "_id",
                  as: "pais_info",
                },
              },
              {
                $unwind: {
                  path: "$pais_info",
                  preserveNullAndEmptyArrays: true,
                },
              },
              { $project: { pais: "$pais_info.nombre", total: 1, _id: 0 } },
            ]),
            // Cuenta noticias publicadas por país
            NoticiaModel.aggregate([
              { $match: { estado: "publicado" } },
              { $group: { _id: "$pais", total: { $sum: 1 } } },
              {
                $lookup: {
                  from: "pais",
                  localField: "_id",
                  foreignField: "_id",
                  as: "pais_info",
                },
              },
              {
                $unwind: {
                  path: "$pais_info",
                  preserveNullAndEmptyArrays: true,
                },
              },
              { $project: { pais: "$pais_info.nombre", total: 1, _id: 0 } },
            ]),
          ]);

        return res.status(200).json({
          ok: true,
          rol: "superadmin",
          metricas: {
            solicitudes_pendientes_por_pais: solicitudesPendientes,
            testimonios_publicados_por_pais: testimoniosPublicados,
            noticias_activas_por_pais: noticiasActivas,
          },
        });
      } else {
        // ── Admin_pais / Editor: métricas filtradas solo a su país ────────
        if (!pais) {
          return res.status(400).json({
            ok: false,
            error_message: "El usuario no tiene país asignado",
          });
        }
        console.log("TODAS LAS NOTICIAS:", await NoticiaModel.find({}));
        const [solicitudesPendientes, testimoniosPublicados, noticiasActivas] =
          await Promise.all([
            SolicitudModel.countDocuments({ estado: "pendiente", pais }),
            TestimonioModel.countDocuments({ estado: "publicado", pais }),
            NoticiaModel.countDocuments({ estado: "publicado", pais }),
          ]);

        return res.status(200).json({
          ok: true,
          rol,
          pais_id: pais,
          metricas: {
            solicitudes_pendientes: solicitudesPendientes,
            testimonios_publicados: testimoniosPublicados,
            noticias_activas: noticiasActivas,
          },
        });
      }
    } catch (error) {
      console.error("Error al obtener métricas del dashboard:", error);
      return res
        .status(500)
        .json({ ok: false, error_message: "Error interno del servidor" });
    }
  }
}
