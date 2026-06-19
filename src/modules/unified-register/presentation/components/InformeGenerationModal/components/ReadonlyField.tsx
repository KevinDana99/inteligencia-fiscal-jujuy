import classes from '../InformeGenerationModal.module.css';

export function ReadonlyField({
  label,
  value,
  strong,
  risk
}: {
  label: string;
  value: string;
  strong?: boolean;
  risk?: boolean;
}) {
  const valueClassName = `${classes.readonlyValue} ${
    strong ? classes.readonlyValueStrong : ''
  } ${risk ? classes.riskValue : ''}`;

  return (
    <div>
      <span className={classes.readonlyLabel}>{label}</span>
      <div className={valueClassName}>{value || '-'}</div>
    </div>
  );
}
