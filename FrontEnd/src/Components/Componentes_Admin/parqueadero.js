import axios from "axios";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
/* Añadir iconos a la libraria */
library.add(faTrash);
library.add(faPenToSquare);
library.add(faSquarePlus);

const Parqueadero = ({ item, currentRecords, apiS }) => {
  const [accion, setAccion] = useState("");

  const [parqueadero, setParqueadero] = useState({
    NumeroEspacio: "",
    TipoEspacio: "",
    Estado: "",
    id: "",
  });

  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [filteredRecords, setFilteredRecords] = useState(currentRecords);
  const [filteredAtt, setFilteredAtt] = useState("");

  const enviar = async (e) => {
    e.preventDefault();

    try {
      if (accion === "Actualizar") {
        if (parqueadero.id) {
          const response = await axios.patch(
            `http://localhost:4000/${apiS}/${parqueadero.id}`,
            {
              NumeroEspacio: parqueadero.NumeroEspacio,
              TipoEspacio: parqueadero.TipoEspacio,
              Estado: parqueadero.Estado,
              id: parqueadero.id,
            }
          );
          console.log(response.status);
          if (response.status === 200) {
            alert("Registro actualizado exitosamente");
            setParqueadero((prevUsuario) => ({
              ...prevUsuario,
              id: "",
            }));
          }
        }
      } else if (accion === "Eliminar") {
        if (parqueadero.id) {
          const response = await axios.delete(
            `http://localhost:4000/${apiS}/${parqueadero.id}`
          );
          console.log(response.status);
          if (response.status === 200) {
            alert("Registro eliminado exitosamente exitosamente");
          }
        }
      } else if (accion === "Insertar") {
        const response = await axios.post(`http://localhost:4000/${apiS}`, {
          NumeroEspacio: parqueadero.NumeroEspacio,
          TipoEspacio: parqueadero.TipoEspacio,
          Estado: parqueadero.Estado,
        });
        console.log(response.status);
        if (response.status === 201) {
          alert("Registro exitoso");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al realizar la operación");
    }
  };

  const setCurrentAccion = (accion) => {
    setAccion(() => accion);
  };

  const eliminar = (record) => {
    const confir = window.confirm("¿ Desea eliminar este registro ?");
    if (confir) {
      if (apiS === "Parqueadero") {
        setParqueadero((prevSalon) => ({
          ...prevSalon,
          id: record,
        }));
      }
      setAccion(() => "Eliminar");
    }
  };

  const fetchFilteredRecords = async (term, att) => {
    try {
      if (term) {
          const response = await axios.get(
            `http://localhost:4000/${apiS}?${att}=${term}`
          );
          if (response.status === 200) {
            setFilteredRecords(response.data);
          }
      } else {
        setFilteredRecords(currentRecords);
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al filtrar los registros");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFilteredRecords(searchTerm, filteredAtt);
  };

  return (
    <>
      <form className="d-flex mb-3" role="search" onSubmit={handleSearch}>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setFilteredAtt("NumeroEspacio");
          }}
        />
        <select
          class="form-select"
          aria-label="Default select example"
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setFilteredAtt("TipoEspacio");
          }}
        >
          <option selected>Open this select menu</option>
          <option value={"Moto"}>Moto</option>
          <option value={"Carro"}>Carro</option>
        </select>
        <button
          onClick={() => setCurrentAccion("Consultar")}
          className="btn btn-outline-success"
          type="submit"
        >
          Search
        </button>
      </form>
      <table
        id="example2"
        className="table table-bordered table-hover dataTable dtr-inline"
        aria-describedby="example2_info"
      >
        <thead>
          <tr>
            {item.map((item, index) => (
              <th
                className="sorting"
                tabIndex="0"
                aria-controls="example2"
                rowSpan="1"
                colSpan="1"
                aria-label="Rendering engine: activate to sort column ascending"
                key={index}
              >
                {item}
              </th>
            ))}
            <th
              className="sorting"
              tabIndex="0"
              aria-controls="example2"
              rowSpan="1"
              colSpan="1"
              aria-label="Platform(s): activate to sort column ascending"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {accion !== "Consultar"
            ? currentRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.NumeroEspacio}</td>
                  <td>{record.TipoEspacio}</td>
                  <td>{record.Estado}</td>
                  <td>
                    <div className="d-flex flex-row">
                      <div className="mx-2">
                        <form className="p-0" onSubmit={enviar}>
                          <button
                            onClick={() => eliminar(record.id)}
                            type="submit"
                            class="btn btn-danger px-2"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </form>
                      </div>
                      <div className="mx-2">
                        <button
                          type="button"
                          className="btn btn-warning px-2 py-1"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                          onClick={() => {
                            setParqueadero((prevParqueadero) => ({
                              ...prevParqueadero,
                              NumeroEspacio: record.NumeroEspacio,
                              TipoEspacio: record.TipoEspacio,
                              Estado: record.Estado,
                              id: record.id,
                            }));
                            setCurrentAccion("Actualizar");
                          }}
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                      </div>
                    </div>
                    <div
                      class="modal fade"
                      id="exampleModal"
                      tabindex="-1"
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                    >
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">
                              {accion} Parqueadero
                            </h1>
                            <button
                              type="button"
                              class="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <form onSubmit={enviar}>
                            <div class="modal-body">
                              <div className="mb-3">
                                <label
                                  htmlFor="exampleInputEmail1"
                                  className="form-label"
                                >
                                  Numero de Espacio
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="exampleInputEmail1"
                                  required
                                  value={parqueadero.NumeroEspacio}
                                  onChange={(e) =>
                                    setParqueadero((prevParqueadero) => ({
                                      ...prevParqueadero,
                                      NumeroEspacio: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="mb-3">
                                <label
                                  htmlFor="exampleInputPassword1"
                                  className="form-label"
                                >
                                  Tipo de Espacio
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="exampleInputPassword1"
                                  required
                                  value={parqueadero.TipoEspacio}
                                  onChange={(e) =>
                                    setParqueadero((prevParqueadero) => ({
                                      ...prevParqueadero,
                                      TipoEspacio: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="mb-3">
                                <label
                                  htmlFor="exampleInputPassword1"
                                  className="form-label"
                                >
                                  Estado
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="exampleInputPassword1"
                                  required
                                  value={parqueadero.Estado}
                                  onChange={(e) =>
                                    setParqueadero((prevParqueadero) => ({
                                      ...prevParqueadero,
                                      Estado: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                            </div>
                            <div class="modal-footer">
                              <button
                                type="button"
                                class="btn btn-danger"
                                data-bs-dismiss="modal"
                              >
                                Cerrar
                              </button>
                              <button
                                type="submit"
                                className={
                                  accion === "Actualizar"
                                    ? "btn btn-warning"
                                    : accion === "Insertar"
                                    ? "btn btn-success w-25 m-0"
                                    : null
                                }
                              >
                                {accion}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            : filteredRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.NumeroEspacio}</td>
                  <td>{record.TipoEspacio}</td>
                  <td>{record.Estado}</td>
                  <td>
                    <div className="d-flex flex-row">
                      <div className="mx-2">
                        <form className="p-0" onSubmit={enviar}>
                          <button
                            onClick={() => eliminar(record.id)}
                            type="submit"
                            className="btn btn-danger px-2"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </form>
                      </div>
                      <div className="mx-2">
                        <button
                          type="button"
                          className="btn btn-warning px-2 py-1"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                          onClick={() => {
                            setParqueadero((prevParqueadero) => ({
                              ...prevParqueadero,
                              NumeroEspacio: record.NumeroEspacio,
                              TipoEspacio: record.TipoEspacio,
                              Estado: record.Estado,
                              id: record.id,
                            }));
                            setCurrentAccion("Actualizar");
                          }}
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
          <div
            class="modal fade"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">
                    {accion} Parqueadero
                  </h1>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <form onSubmit={enviar}>
                  <div class="modal-body">
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputEmail1"
                        className="form-label"
                      >
                        Numero de Espacio
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="exampleInputEmail1"
                        required
                        value={parqueadero.NumeroEspacio}
                        onChange={(e) =>
                          setParqueadero((prevParqueadero) => ({
                            ...prevParqueadero,
                            NumeroEspacio: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputPassword1"
                        className="form-label"
                      >
                        Tipo de Espacio
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="exampleInputPassword1"
                        required
                        value={parqueadero.TipoEspacio}
                        onChange={(e) =>
                          setParqueadero((prevParqueadero) => ({
                            ...prevParqueadero,
                            TipoEspacio: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputPassword1"
                        className="form-label"
                      >
                        Estado
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="exampleInputPassword1"
                        required
                        value={parqueadero.Estado}
                        onChange={(e) =>
                          setParqueadero((prevParqueadero) => ({
                            ...prevParqueadero,
                            Estado: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-danger"
                      data-bs-dismiss="modal"
                    >
                      Cerrar
                    </button>
                    <button
                      type="submit"
                      className={
                        accion === "Actualizar"
                          ? "btn btn-warning"
                          : accion === "Insertar"
                          ? "btn btn-success w-25 m-0"
                          : null
                      }
                    >
                      {accion}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </tbody>
        <tfoot>
          <tr>
            <th colSpan="3"></th>
            <th rowSpan="1" colSpan="1">
              <button
                type="button"
                className="btn btn-success p-0 m-0 w-50"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() => {
                  setParqueadero((prevReuniones) => ({
                    ...prevReuniones,
                    NumeroEspacio: "",
                    TipoEspacio: "",
                    Estado: "",
                  }));
                  setCurrentAccion("Insertar");
                }}
              >
                <FontAwesomeIcon icon={faSquarePlus} />
              </button>
            </th>
          </tr>
        </tfoot>
      </table>
    </>
  );
};

export default Parqueadero;
