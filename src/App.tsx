import { FormEvent, useEffect, useState } from "react";
import "./App.css";
import { useConnectSocket } from "./hooks/useConnectSocket";
import { EventsType } from "./interfaces/events";

function App() {
	const { status, clientsConnected, socketServer, messages, connectToServer } =
		useConnectSocket();

	const [input, setInput] = useState<string>("");

	const [inputJwt, setInputJwt] = useState<string>("");

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (input.trim().length === 0) return;

		socketServer?.emit(EventsType.messageFromClient, {
			id: "yo",
			message: input,
		});

		setInput("");
	};

	const onClick = () => {
		if (inputJwt.trim().length === 0) return;
		connectToServer(inputJwt);
	};

	return (
		<div className="App">
			<h1>Websocket - client</h1>
			<div>
				<input
					value={inputJwt}
					onChange={(e) => setInputJwt(e.target.value)}
					type="text"
					placeholder="Json web token"
				/>
				<button onClick={onClick}>Send</button>
			</div>
			<p>{status}</p>
			{clientsConnected.length > 0 && (
				<ul>
					{clientsConnected.map((id) => (
						<li key={id}>{id}</li>
					))}
				</ul>
			)}
			<hr />
			{status === "connected" && (
				<div>
					<form onSubmit={onSubmit}>
						<input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							type="text"
							placeholder="Message"
						/>
					</form>
					<hr />
					<ul>
						{messages.map((message, index) => (
							<li key={message.body + index}>
								<b>{message.fullname}</b> : {message.body}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

export default App;
