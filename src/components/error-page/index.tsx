import { CustomError } from '../../constants/errors';
import '../bento/bento.css';

/**
 * Full-page error in the same style as the bento layout.
 */
const ErrorPage: React.FC<CustomError> = (props) => {
  return (
    <div className="hv-root hv-error">
      <div className="hv-t">
        <div className="hv-error-code">{props.status}</div>
        <p className="hv-error-title">{props.title}</p>
        <div className="hv-error-sub">{props.subTitle}</div>
      </div>
    </div>
  );
};

export default ErrorPage;
