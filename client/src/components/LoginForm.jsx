import { useActionState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router";


/**
 * Props received:
 * - handleLogin: function - Handler function for login submission
 */
function LoginForm(props) {
    const [state, formAction] = useActionState(submitCredentials, { username: '', password: '' })

    async function submitCredentials(prevData, formData) {
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password')
        }
        try {
            await props.handleLogin(credentials);
            return { success: true }
        }
        catch (error) {
            return { error: 'Invalid credentials' };
        }
    }
    
    return (
        <Form action={formAction}>
            <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                    type='text' 
                    name="username" 
                    placeholder="Enter your username"
                    required 
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control 
                    type='password' 
                    name='password' 
                    placeholder="Enter your password"
                    required
                />
            </Form.Group>

            {state.error && (
                <div className="alert alert-danger text-center" role="alert">
                    {state.error}
                </div>
            )}

            <div className="d-grid gap-2">
                <Button type='submit' variant="primary" size="lg">
                    Login
                </Button>
                <Link className="btn btn-outline-secondary" to={'/'}>
                    Cancel
                </Link>
            </div>
        </Form>
    );
}

export default LoginForm;