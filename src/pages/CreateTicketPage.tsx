import {MatrixClientContext} from "@/contexts/MatrixClientContext";
import {createTicket} from "@/helpers/ticket/createTicket";
import {ChangeEventHandler, useContext, useState} from "react";
import {useNavigate} from "react-router-dom";

export function CreateTicketPage() {
  const [ticketFormState, setTicketFormState] = useState({
    title: "",
    description: "",
  });
  const [errorState, setErrorState] = useState({
    title: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {client} = useContext(MatrixClientContext);
  const navigate = useNavigate();

  // @TODO: Use validation library like yup.
  const validate = (field: "title" | "description", value: string) => {
    if (value === "") {
      setErrorState((prevState) => ({
        ...prevState,
        [field]: "Bitte fülle dieses Feld aus.",
      }));
    } else {
      setErrorState((prevState) => ({
        ...prevState,
        [field]: "",
      }));
    }
  };

  const changeHandler: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    setTicketFormState((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
    validate(e.target.id as "title" | "description", e.target.value);
  };

  const createTicketAndClearForm = async () => {
    validate("title", ticketFormState.title);
    validate("description", ticketFormState.description);
    if (ticketFormState.title && ticketFormState.description && !isSubmitting) {
      setIsSubmitting(true);
      createTicket(
        client,
        ticketFormState.title,
        ticketFormState.description,
      ).then(() => {
        setTicketFormState({title: "", description: ""});
        navigate("/protected");
      });
    }
  };

  if (!client.isLoggedIn()) {
    navigate("/");
  }

  return (
    <div className="w-full p-2 md:p-24">
      <div className="-mx-3 mb-6 flex flex-wrap">
        <div className="mb-6 w-full px-3">
          <label
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
            htmlFor="title"
          >
            Titel
          </label>
          <input
            className={`mb-3 block w-full appearance-none rounded border bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:bg-white focus:outline-none ${
              errorState.title ? "border-red-500" : ""
            }`}
            id="title"
            type="text"
            placeholder="Beschreibe dein Problem in 1-2 Sätzen."
            onChange={changeHandler}
            value={ticketFormState.title}
          />
          {errorState.title && (
            <p className="text-xs italic text-red-500">{errorState.title}</p>
          )}
        </div>
        <div className="mb-6 w-full px-3">
          <label
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
            htmlFor="description"
          >
            Beschreibung
          </label>
          <textarea
            className={`mb-3 block w-full appearance-none rounded border bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:bg-white focus:outline-none ${
              errorState.description ? "border-red-500" : ""
            }`}
            id="description"
            placeholder="Gib eine möglichst detailierte Beschreibung des Problems."
            rows={12}
            onChange={changeHandler}
            value={ticketFormState.description}
          />
          {errorState.description && (
            <p className="text-xs italic text-red-500">
              {errorState.description}
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <button
          title="Abbrechen"
          className="rounded-md border bg-blue-50 px-3 py-2 leading-none hover:bg-blue-100"
          onClick={() => navigate("/protected")}
        >
          Abbrechen
        </button>
        <button
          disabled={isSubmitting}
          title="Ticket erstellen"
          className="rounded-md border bg-blue-50 px-3 py-2 leading-none hover:bg-blue-100"
          onClick={() => createTicketAndClearForm()}
        >
          Ticket erstellen
        </button>
      </div>
    </div>
  );
}
