import { Suspense, Component } from "react";
import { useFederatedComponent } from "./useFederatedComponent";

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error });
        this.props.captureError?.(error, errorInfo);
    }

    render() {
        const { error } = this.state;
        const { children } = this.props;

        if (error !== null) {
            return <p style={{ color: "#D0021B" }}>Error loading component</p>;
        }

        return children;
    }
}

function FederatedLoader({ scope, module, ...props }) {
    const Component = useFederatedComponent(scope, module);
    return Component && <Component {...props} />;
}

export function FederatedComponent({
    scope,
    module,
    fallback,
    captureError,
    ...props
}) {
    return (
        <ErrorBoundary captureError={captureError}>
            <Suspense fallback={fallback}>
                <FederatedLoader scope={scope} module={module} {...props} />
            </Suspense>
        </ErrorBoundary>
    );
}
