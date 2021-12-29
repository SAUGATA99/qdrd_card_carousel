import { createCustomElement, actionTypes } from "@servicenow/ui-core";
import snabbdom from "@servicenow/ui-renderer-snabbdom";
import styles from "./styles.scss";
const { COMPONENT_RENDER_REQUESTED } = actionTypes;

const view = (state, { updateState, dispatch }) => {
	const {
		properties: { cardItems },
		currentItemIndex,
		dots,
	} = state;

	const cardClicked = (cardURL) => {
		console.log("Card Clicked"); /////////////////
		if (cardURL) {
			window.open(cardURL, "_blank");
		}
		// dispatch("QDRD_CAROUSEL#CLICKED"); //dispatch click event
	};
	const cardButtonClicked = (event, buttonURL) => {
		console.log("Button Clicked"); ///////////////
		if (buttonURL) {
			window.open(buttonURL, "_blank");
		}
		// dispatch("QDRD_CAROUSEL#BUTTON_CLICKED"); // disptach click event
		event.stopPropagation(); // stop event bubble from reaching parent elements
	};

	// for slideshow
	var timeoutI = setTimeout(() => {
		if (currentItemIndex == cardItems.length - 1) {
			updateState({
				currentItemIndex: 0, // go back to first card
			});
		} else {
			updateState({
				currentItemIndex: currentItemIndex + 1,
			});
		}
	}, 5000);

	// clearTimeout(timeoutID); //prevent timeout memory leak

	const button = cardItems[currentItemIndex].buttonLabel ? (
		<button
			on-click={(event) =>
				cardButtonClicked(event, cardItems[currentItemIndex].buttonURL)
			}
		>
			{cardItems[currentItemIndex].buttonLabel}
		</button>
	) : null;

	return (
		<div
			className="card"
			on-click={() => cardClicked(cardItems[currentItemIndex].cardURL)}
			style={
				cardItems[currentItemIndex].imgURL
					? {
							backgroundImage: `url("${cardItems[currentItemIndex].imgURL}")`,
					  }
					: { backgroundColor: "#0dba86" }
			}
		>
			<p style={{ overflow: "hidden" }}>
				{cardItems[currentItemIndex].title || "Lorem Ipsum"}
			</p>
			<div className="button_container">{button}</div>
			{/* dots for navigation */}
			<div className="dot-container">{dots}</div>
		</div>
	);
};

createCustomElement("qdsdp-qdrd-carousel", {
	renderer: { type: snabbdom },
	view,
	properties: {
		cardItems: {
			schema: {
				type: "array",
				items: {
					type: "object",
					properties: {
						title: { type: "string" },
						imgURL: { type: "string" },
						cardURL: { type: "string" },
						buttonLabel: { type: "string" },
						buttonURL: { type: "string" },
					},
					required: ["title"],
				},
			},
		},
	},
	initialState: {
		currentItemIndex: 0,
	},
	actionHandlers: {
		//lifecycle Action Handler, executed before every render
		[COMPONENT_RENDER_REQUESTED]: ({
			state,
			properties,
			updateState,
			action: {
				payload: { previousRenderState },
			},
		}) => {
			if (
				state.currentItemIndex !== previousRenderState.currentItemIndex &&
				properties.cardItems.length > 1
			) {
				updateState({
					dots: properties.cardItems.map((item, index) => (
						<div
							id={index}
							className="dot"
							class={{
								dot_active: index == state.currentItemIndex ? true : false,
							}}
							on-click={(event) => {
								updateState({
									currentItemIndex: event.target.id,
								});
								event.stopPropagation();
							}}
						></div>
					)),
				});
			}
		},
	},
	styles,
});
