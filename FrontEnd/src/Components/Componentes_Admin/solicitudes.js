import { useState } from "react";
import axios from "axios";

const Solicitudes = ({ currentRecords, length }) => {
  const [data, setDatos] = useState({
    CodigoVivienda: "",
    Nombre: "",
    Apellido: "",
    Teléfono: "",
    Correo: "",
    NumeroDocumento: "",
    MesesAtrasados: 0,
    EspacioParqueadero: 0,
    User: "",
    Pass: "",
    id: "",
  });

  const enviar = async (e) => {
    e.preventDefault();

    try {
      // Solicitud GET para obtener los datos del usuario
      const response1 = await axios.post(`http://localhost:4000/Propietarios`, {
        CodigoVivienda: data.CodigoVivienda,
        Nombre: `${data.Nombre} ${data.Apellido}`,
        Teléfono: data.Teléfono,
        Correo: data.Correo,
        NumeroDocumento: data.NumeroDocumento,
        MesesAtrasados: data.MesesAtrasados,
        EspacioParqueadero: data.EspacioParqueadero,
        User: data.User,
        Pass: data.Pass,
      });

      const response2 = await axios.delete(
        `http://localhost:4000/Solicitudes/${data.NumeroDocumento}`
      );
      console.log(response1.status, response2.status);
      if (response1.status === 201 && response2.status === 200) {
        alert("Solicitud aprobada");
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al aprobar la solicitud");
    }
  };

  const cancelarEnviar = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.delete(
        `http://localhost:4000/Solicitudes/${data.NumeroDocumento}`
      );
      console.log(response.status);
      if (response.status === 200) {
        alert("Solicitud cancelada");
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al aprobar la solicitud");
    }
  };

  return (
    <div className="accordion" id="accordionExample">
      {length === 0 ? (
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={"#collapse"}
              aria-expanded="false"
              aria-controls={"collapse"}
            >
              No hay solicitudes
            </button>
          </h2>
          <div
            id={"collapse"}
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          ></div>
        </div>
      ) : (
        currentRecords.map((record, index) => (
          <div key={index} className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={"#collapse" + index}
                aria-expanded="false"
                aria-controls={"collapse" + index}
              >
                Solicitud de creación de cuenta numero {index + 1}
              </button>
            </h2>
            <div
              id={"collapse" + index}
              className="accordion-collapse collapse"
              data-bs-parent="#accordionExample"
            >
              <div className="d-flex flex-column">
                <div className="w-100">
                  <div className="accordion-body">
                    <ul className="list-group">
                      <li className="list-group-item">{`Nombre: ${record.Nombre} ${record.Apellido}`}</li>
                      <li className="list-group-item">{`Numero de documento: ${record.NumeroDocumento}`}</li>
                      <li className="list-group-item">{`Teléfono: ${record.Teléfono}`}</li>
                      <li className="list-group-item">{`Correo: ${record.Correo}`}</li>
                      <li className="list-group-item">{`Codigo de vivienda: ${record.CodigoVivienda}`}</li>
                    </ul>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-end">
                  <div className="mb-3 mx-4">
                    <a
                      href="/certificado.pdf"
                      download={`cretificado ${record.Nombre} ${record.Apellido}`}
                      className="btn btn-primary m-0"
                    >
                      Ver documento de verificación
                    </a>
                  </div>
                  <div className="mb-3 mx-2">
                    <form onSubmit={enviar}>
                      <button
                        onClick={() =>
                          setDatos((prevUsuario) => ({
                            ...prevUsuario,
                            CodigoVivienda: record.CodigoVivienda,
                            Nombre: record.Nombre,
                            Apellido: record.Apellido,
                            Teléfono: record.Teléfono,
                            Correo: record.Correo,
                            NumeroDocumento: record.NumeroDocumento,
                            MesesAtrasados: 0,
                            EspacioParqueadero: 0,
                            User: record.Nombre + record.NumeroDocumento,
                            Pass: record.NumeroDocumento,
                            id: record.NumeroDocumento,
                          }))
                        }
                        type="submit"
                        className="btn btn-success m-0"
                      >
                        Aprobar
                      </button>
                    </form>
                  </div>
                  <div className="mx-4">
                    <form onSubmit={cancelarEnviar}>
                      <button
                        onClick={() =>
                          setDatos((prevUsuario) => ({
                            ...prevUsuario,
                            NumeroDocumento: record.NumeroDocumento,
                            id: record.NumeroDocumento,
                          }))
                        }
                        type="submit"
                        className="btn btn-danger"
                      >
                        Cancelar
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Solicitudes;
