import { Card } from "react-bootstrap";
import '../CustomStyles/CustomStyles.css'

/**
 * Props received:
 * - badLuckIndex: number - The bad luck index value of the card
 * - situationName: string - The situation description text
 * - image: string - The image filename for the card
 * - showBadLuckIndex: boolean - Whether to show the bad luck index or "??"
 */
function BadLuckCard(props) {
    return (
        <Card className="BadLuckCard">
            {props.image && (
                <Card.Img 
                    variant="top" 
                    src={`http://localhost:3001/images/${props.image}`} 
                    alt="Bad Luck Card" 
                />
            )}
            <Card.Body>
                <Card.Title>
                    {props.showBadLuckIndex ? props.badLuckIndex : "??"}
                </Card.Title>
                <Card.Text>
                    {props.situationName}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default BadLuckCard;