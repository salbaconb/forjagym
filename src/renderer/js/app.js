(function(){
'use strict';
var KEY='forja-cuentas-v2';
/* ====== SUPABASE: pega aquí los dos datos de tu proyecto (Project Settings > API) ====== */
var SUPABASE_URL='';   /* ej.: https://abcdxyz.supabase.co */
var SUPABASE_KEY='';   /* la clave "anon public" */
var SUPA=!!(SUPABASE_URL&&SUPABASE_KEY);
var RANKS=['Hierro','Bronce','Plata','Oro','Platino','Diamante'];
var GOALS={fuerza:{n:'Fuerza',main:5,acc:8},musculo:{n:'Músculo',main:8,acc:12},definicion:{n:'Definición',main:10,acc:15}};
var EX={
  bench:{n:'Press banca',m:'Pecho',main:1,k:.6},
  squat:{n:'Sentadilla',m:'Pierna',main:1,k:.8},
  deadlift:{n:'Peso muerto',m:'Espalda y pierna',main:1,k:1},
  ohp:{n:'Press militar',m:'Hombro',main:1,k:.4},
  row:{n:'Remo con barra',m:'Espalda',main:1,k:.55},
  incline:{n:'Press inclinado con mancuernas',m:'Pecho',k:.22},
  pulldown:{n:'Jalón al pecho',m:'Espalda',k:.5},
  legpress:{n:'Prensa de piernas',m:'Pierna',k:1.2},
  rdl:{n:'Peso muerto rumano',m:'Isquios',k:.6},
  curl:{n:'Curl de bíceps',m:'Bíceps',k:.2},
  pushdown:{n:'Extensión de tríceps en polea',m:'Tríceps',k:.3},
  lateral:{n:'Elevaciones laterales',m:'Hombro',k:.1},
  calf:{n:'Gemelos de pie',m:'Gemelo',k:.6},
  thrust:{n:'Hip thrust',m:'Glúteo',k:.8},
  face:{n:'Face pull',m:'Hombro posterior',k:.25},
  legcurl:{n:'Curl femoral',m:'Isquios',k:.35}
};
var INFO={
  bench:{g:'Pecho',eq:'Barra y banco',sec:'Tríceps y hombro anterior',tips:['Tumbado, con los omóplatos juntos y los pies firmes en el suelo.','Baja la barra controlada hasta rozar el pecho.','Empuja hasta estirar los brazos, sin lanzar la barra.']},
  squat:{g:'Pierna',eq:'Barra y rack',sec:'Glúteo y core',tips:['Barra sobre la espalda alta y pies a la anchura de los hombros.','Baja con la espalda recta hasta que el muslo quede paralelo al suelo.','Sube empujando con todo el pie, sin cerrar las rodillas.']},
  deadlift:{g:'Espalda',eq:'Barra',sec:'Glúteo, isquios y trapecio',tips:['Barra sobre el medio del pie, espalda recta y pecho arriba.','Empuja el suelo con las piernas y lleva la cadera hacia delante.','Baja la barra pegada a las piernas, sin redondear la espalda.']},
  ohp:{g:'Hombro',eq:'Barra',sec:'Tríceps y core',tips:['Barra a la altura de la clavícula, glúteos y abdomen apretados.','Empuja hacia arriba pasando la barra cerca de la cara.','Termina con los brazos estirados sobre la cabeza y baja con control.']},
  row:{g:'Espalda',eq:'Barra',sec:'Bíceps y dorsal',tips:['Torso inclinado casi paralelo al suelo y espalda recta.','Tira de la barra hacia el abdomen llevando los codos atrás.','Baja despacio hasta estirar los brazos.']},
  incline:{g:'Pecho',eq:'Mancuernas y banco inclinado',sec:'Hombro anterior y tríceps',tips:['Banco a unos 30 grados y mancuernas a la altura del pecho.','Empuja hacia arriba juntando ligeramente las mancuernas.','Baja controlado hasta sentir el estiramiento del pecho.']},
  pulldown:{g:'Espalda',eq:'Polea alta',sec:'Bíceps y dorsal',tips:['Agarra la barra un poco más ancha que los hombros y bloquea los muslos.','Tira de la barra hacia la parte alta del pecho sacando el pecho.','Sube despacio hasta estirar los brazos sin que te levante el peso.']},
  legpress:{g:'Pierna',eq:'Máquina de prensa',sec:'Glúteo',tips:['Espalda y cadera pegadas al respaldo, pies a la anchura de los hombros.','Baja hasta que las rodillas formen unos 90 grados.','Empuja sin bloquear del todo las rodillas arriba.']},
  rdl:{g:'Pierna',eq:'Barra o mancuernas',sec:'Glúteo y espalda baja',tips:['De pie, con las rodillas ligeramente flexionadas.','Lleva la cadera hacia atrás y baja la barra pegada a las piernas.','Sube apretando el glúteo cuando notes tensión en los isquios.']},
  curl:{g:'Brazos',eq:'Mancuernas',sec:'Antebrazo',tips:['Codos pegados al cuerpo y muñecas firmes.','Sube las mancuernas sin balancear el torso.','Baja despacio hasta estirar el brazo.']},
  pushdown:{g:'Brazos',eq:'Polea con barra o cuerda',sec:'Antebrazo',tips:['Codos pegados a los costados, torso erguido.','Estira los brazos hacia abajo apretando el tríceps.','Sube hasta que el antebrazo quede casi horizontal, sin mover los codos.']},
  lateral:{g:'Hombro',eq:'Mancuernas',sec:'Trapecio',tips:['Mancuernas a los lados y ligera flexión de codos.','Sube los brazos hasta la altura de los hombros.','Baja lento, sin impulso del cuerpo.']},
  calf:{g:'Pierna',eq:'Escalón o máquina',sec:'Sóleo',tips:['Apoya la parte delantera del pie en el borde de un escalón.','Sube todo lo que puedas sobre las puntas.','Baja hasta estirar el gemelo y repite sin rebotar.']},
  thrust:{g:'Pierna',eq:'Barra y banco',sec:'Isquios',tips:['Parte alta de la espalda apoyada en el banco y la barra sobre la cadera.','Empuja con los talones hasta alinear hombros, cadera y rodillas.','Aprieta el glúteo arriba y baja controlado.']},
  face:{g:'Hombro',eq:'Polea con cuerda',sec:'Dorsal alto y manguito',tips:['Polea a la altura de la cara y agarre con las palmas enfrentadas.','Tira hacia la cara abriendo los codos.','Vuelve despacio sin dejar que el peso te arrastre.']},
  legcurl:{g:'Pierna',eq:'Máquina de curl femoral',sec:'Gemelo',tips:['Tumbado boca abajo con el rodillo sobre los tobillos.','Flexiona las rodillas llevando los talones hacia los glúteos.','Baja despacio sin separar la cadera del banco.']},
  pullup:{g:'Espalda',eq:'Barra de dominadas',sec:'Bíceps y antebrazo',tips:['Agarra la barra un poco más ancha que los hombros y cuélgate con los brazos estirados.','Tira de los codos hacia abajo hasta pasar la barbilla por encima de la barra.','Baja despacio hasta estirar los brazos del todo.']},
  dips:{g:'Pecho',eq:'Paralelas',sec:'Tríceps y hombro anterior',tips:['Apóyate con los brazos estirados y el torso ligeramente inclinado hacia delante.','Baja doblando los codos hasta que formen unos 90 grados.','Empuja con las palmas hasta volver arriba sin encoger los hombros.']},
  pushup:{g:'Pecho',eq:'Peso corporal',sec:'Tríceps, hombro y core',tips:['Manos bajo los hombros y cuerpo recto de cabeza a talones.','Baja el pecho hasta casi tocar el suelo con los codos a unos 45 grados.','Empuja el suelo hasta estirar los brazos sin hundir la cadera.']},
  crunch:{g:'Abdomen',eq:'Colchoneta',sec:'Oblicuos',tips:['Tumbado, con las rodillas dobladas, los pies apoyados y las manos tras la cabeza.','Eleva los hombros del suelo contrayendo el abdomen.','Baja despacio sin tirar del cuello.']},
  legraise:{g:'Abdomen',eq:'Barra de dominadas',sec:'Flexores de cadera y antebrazo',tips:['Cuélgate de la barra con los hombros activados.','Sube las piernas hasta la altura de la cadera sin balancearte.','Baja controlado sin perder la tensión del abdomen.']},
  lunge:{g:'Pierna',eq:'Mancuernas',sec:'Glúteo e isquios',tips:['De pie con una mancuerna en cada mano y el torso erguido.','Da un paso largo y baja hasta que la rodilla trasera casi toque el suelo.','Empuja con el pie delantero para volver a la posición inicial.']},
  legext:{g:'Pierna',eq:'Máquina de extensión de cuádriceps',sec:'Recto femoral',tips:['Ajusta el respaldo para que las rodillas queden alineadas con el eje de la máquina.','Estira las piernas hasta arriba contrayendo el cuádriceps.','Baja despacio sin dejar caer el peso.']},
  shrug:{g:'Hombro',eq:'Mancuernas',sec:'Antebrazo',tips:['De pie con una mancuerna en cada mano y los brazos estirados.','Sube los hombros hacia las orejas sin doblar los codos.','Mantén un segundo arriba y baja despacio.']},
  backext:{g:'Espalda',eq:'Banco de hiperextensiones',sec:'Glúteo e isquios',tips:['Apoya las caderas en el cojín y cruza los brazos sobre el pecho.','Sube el torso hasta formar una línea recta con las piernas.','Baja controlado sin redondear la espalda.']},
  seatedrow:{g:'Espalda',eq:'Polea baja',sec:'Bíceps y trapecio',tips:['Siéntate con la espalda recta y las rodillas ligeramente flexionadas.','Tira del agarre hacia el abdomen juntando los omóplatos.','Vuelve despacio estirando los brazos sin encorvarte.']},
  chestpress:{g:'Pecho',eq:'Máquina de press de pecho',sec:'Tríceps y hombro anterior',tips:['Ajusta el asiento para que los agarres queden a la altura del pecho.','Empuja hacia delante hasta estirar los brazos.','Vuelve despacio sin apoyar las placas entre repeticiones.']},
  kickback:{g:'Pierna',eq:'Polea baja con tobillera',sec:'Isquios',tips:['Agarra la máquina con el torso ligeramente inclinado y la tobillera puesta.','Lleva la pierna hacia atrás apretando el glúteo.','Vuelve despacio sin arquear la espalda.']},
  dbbench:{g:'Pecho',eq:'Mancuernas y banco',sec:'Tríceps y hombro anterior',tips:['Tumbado con una mancuerna en cada mano a la altura del pecho.','Empuja hacia arriba hasta estirar los brazos, juntando las mancuernas.','Baja controlado hasta notar el estiramiento del pecho.']},
  inclinebb:{g:'Pecho',eq:'Barra y banco inclinado',sec:'Hombro anterior y tríceps',tips:['Banco a unos 30 grados y agarre un poco más ancho que los hombros.','Baja la barra hasta la parte alta del pecho.','Empuja hasta estirar los brazos sin separar la espalda del banco.']},
  pullover:{g:'Pecho',eq:'Mancuerna y banco',sec:'Dorsal y tríceps',tips:['Tumbado en el banco, sujeta una mancuerna con ambas manos sobre el pecho.','Baja la mancuerna detrás de la cabeza con los brazos casi rectos.','Vuelve a la posición inicial contrayendo el pecho.']},
  dbrow:{g:'Espalda',eq:'Mancuerna y banco',sec:'Bíceps y trapecio',tips:['Apoya una mano y una rodilla en el banco con la espalda recta.','Tira de la mancuerna hacia la cadera llevando el codo atrás.','Baja despacio hasta estirar el brazo.']},
  chinup:{g:'Espalda',eq:'Barra de dominadas',sec:'Bíceps',tips:['Agarra la barra con las palmas hacia ti, a la anchura de los hombros.','Sube hasta pasar la barbilla por encima de la barra.','Baja despacio hasta estirar los brazos.']},
  invrow:{g:'Espalda',eq:'Barra baja o máquina Smith',sec:'Bíceps y trapecio',tips:['Colócate debajo de la barra con el cuerpo recto y los talones en el suelo.','Tira del pecho hacia la barra juntando los omóplatos.','Baja controlado sin hundir la cadera.']},
  closegrip:{g:'Espalda',eq:'Polea alta con agarre estrecho',sec:'Bíceps',tips:['Agarre estrecho con las palmas enfrentadas y torso ligeramente inclinado.','Tira hacia el pecho llevando los codos junto al cuerpo.','Sube despacio hasta estirar los brazos.']},
  dbohp:{g:'Hombro',eq:'Mancuernas y banco con respaldo',sec:'Tríceps',tips:['Sentado con la espalda apoyada y las mancuernas a la altura de los hombros.','Empuja hacia arriba hasta estirar los brazos.','Baja despacio hasta que los codos formen 90 grados.']},
  upright:{g:'Hombro',eq:'Barra',sec:'Trapecio y bíceps',tips:['De pie con la barra agarrada a la anchura de los hombros.','Sube la barra pegada al cuerpo con los codos por encima de las manos.','Baja despacio sin balancearte.']},
  frontraise:{g:'Hombro',eq:'Mancuernas',sec:'Pecho alto',tips:['De pie con las mancuernas delante de los muslos.','Sube los brazos al frente hasta la altura del hombro.','Baja lento sin impulsarte con el cuerpo.']},
  machshoulder:{g:'Hombro',eq:'Máquina de press de hombros',sec:'Tríceps',tips:['Ajusta el asiento para que los agarres queden a la altura de los hombros.','Empuja hacia arriba hasta estirar los brazos.','Baja controlado sin apoyar las placas.']},
  barbellcurl:{g:'Brazos',eq:'Barra',sec:'Antebrazo',tips:['De pie con la barra agarrada con las palmas hacia arriba.','Sube la barra sin mover los codos ni balancear el torso.','Baja despacio hasta estirar los brazos.']},
  inclinecurl:{g:'Brazos',eq:'Mancuernas y banco inclinado',sec:'Antebrazo',tips:['Sentado en el banco inclinado con los brazos colgando.','Flexiona los codos subiendo las mancuernas sin adelantar los hombros.','Baja despacio para estirar el bíceps.']},
  preacher:{g:'Brazos',eq:'Banco predicador y barra Z',sec:'Antebrazo',tips:['Apoya los brazos sobre el cojín con los codos alineados.','Sube la barra hasta que el antebrazo quede casi vertical.','Baja controlado sin bloquear los codos.']},
  overheadtri:{g:'Brazos',eq:'Mancuerna',sec:'Antebrazo',tips:['Sostén una mancuerna con ambas manos sobre la cabeza.','Baja la mancuerna detrás de la cabeza doblando solo los codos.','Estira los brazos hasta arriba apretando el tríceps.']},
  skullcrusher:{g:'Brazos',eq:'Barra Z y banco',sec:'Antebrazo',tips:['Tumbado con la barra sobre el pecho y los codos apuntando al techo.','Baja la barra hacia la frente doblando solo los codos.','Estira los brazos hasta volver arriba.']},
  tricepskick:{g:'Brazos',eq:'Mancuerna',sec:'Antebrazo',tips:['Torso inclinado con el codo pegado al costado.','Estira el brazo hacia atrás hasta dejarlo recto.','Vuelve despacio sin mover el codo.']},
  benchdip:{g:'Brazos',eq:'Banco',sec:'Pecho y hombro anterior',tips:['Apoya las manos en el borde del banco con las piernas estiradas.','Baja doblando los codos hacia atrás hasta unos 90 grados.','Empuja con las palmas hasta estirar los brazos.']},
  frontsquat:{g:'Pierna',eq:'Barra y rack',sec:'Glúteo y core',tips:['Barra apoyada en la parte delantera de los hombros con los codos altos.','Baja con el torso erguido hasta que el muslo quede paralelo.','Sube empujando el suelo sin dejar caer los codos.']},
  goblet:{g:'Pierna',eq:'Mancuerna',sec:'Glúteo y core',tips:['Sujeta una mancuerna contra el pecho con ambas manos.','Baja con la espalda recta y las rodillas hacia fuera.','Sube empujando con todo el pie.']},
  smith:{g:'Pierna',eq:'Máquina Smith',sec:'Glúteo',tips:['Barra a la altura de los hombros y pies un poco adelantados.','Baja hasta que el muslo quede paralelo al suelo.','Sube sin bloquear las rodillas.']},
  stepup:{g:'Pierna',eq:'Cajón y mancuernas',sec:'Glúteo',tips:['Pon un pie completo sobre el cajón con una mancuerna en cada mano.','Sube empujando con la pierna de arriba hasta quedar de pie.','Baja controlado con la misma pierna delante.']},
  bulgarian:{g:'Pierna',eq:'Banco y mancuernas',sec:'Glúteo',tips:['Apoya el empeine de un pie en el banco, detrás de ti.','Baja con la pierna delantera hasta que el muslo quede paralelo.','Sube empujando con el talón delantero.']},
  glutebridge:{g:'Pierna',eq:'Colchoneta',sec:'Isquios',tips:['Tumbado con las rodillas dobladas y los pies apoyados.','Sube la cadera apretando los glúteos hasta alinear hombros y rodillas.','Baja despacio sin apoyar del todo.']},
  goodmorning:{g:'Pierna',eq:'Barra',sec:'Espalda baja y glúteo',tips:['Barra sobre la espalda alta y rodillas ligeramente flexionadas.','Lleva la cadera atrás inclinando el torso con la espalda recta.','Sube apretando glúteos e isquios.']},
  seatedcalf:{g:'Pierna',eq:'Máquina de gemelos sentado',sec:'Sóleo',tips:['Siéntate con la parte delantera del pie en la plataforma y el cojín sobre las rodillas.','Sube los talones todo lo posible.','Baja despacio hasta estirar el gemelo.']},
  seatedlegcurl:{g:'Pierna',eq:'Máquina de curl femoral sentado',sec:'Gemelo',tips:['Ajusta el respaldo y el cojín sobre los tobillos.','Flexiona las rodillas llevando los talones hacia abajo y atrás.','Sube despacio sin despegar los muslos del asiento.']},
  kbswing:{g:'Pierna',eq:'Kettlebell',sec:'Espalda baja y hombros',tips:['Kettlebell delante de ti, cadera atrás y espalda recta.','Empuja la cadera hacia delante para lanzar la pesa a la altura del pecho.','Deja que baje entre las piernas controlando con la cadera.']},
  plank:{g:'Abdomen',eq:'Colchoneta',sec:'Hombros y glúteo',tips:['Antebrazos en el suelo con los codos bajo los hombros.','Cuerpo recto de cabeza a talones apretando abdomen y glúteos.','Mantén la posición sin hundir la cadera.']},
  lyingraise:{g:'Abdomen',eq:'Colchoneta',sec:'Flexores de cadera',tips:['Tumbado con las manos bajo los glúteos y las piernas estiradas.','Sube las piernas hasta la vertical sin despegar la espalda baja.','Baja despacio sin tocar el suelo.']},
  diamondpush:{g:"Brazos",eq:"Peso corporal",sec:"Pecho y hombro anterior",cal:1,tips:["Manos juntas bajo el pecho formando un rombo con pulgares e índices.", "Cuerpo recto y codos pegados a las costillas al bajar.", "Baja hasta rozar las manos con el pecho y empuja con control."]},
  widepush:{g:"Pecho",eq:"Peso corporal",sec:"Hombro anterior y tríceps",cal:1,tips:["Manos más separadas que los hombros y dedos hacia delante.", "Abdomen y glúteos apretados para no hundir la cadera.", "Baja el pecho hasta casi tocar el suelo y sube sin bloquear."]},
  declinepush:{g:"Pecho",eq:"Banco o escalón",sec:"Hombro anterior y tríceps",cal:1,tips:["Pies sobre un banco y manos en el suelo bajo los hombros.", "Mantén el cuerpo en una sola línea de cabeza a talones.", "Baja controlado; cuanto más alto el banco, más trabaja el pecho alto."]},
  pikepush:{g:"Hombro",eq:"Peso corporal",sec:"Tríceps y trapecio",cal:1,tips:["Cadera alta formando una V invertida con manos y pies en el suelo.", "Baja la cabeza entre las manos doblando los codos.", "Empuja hacia arriba hasta estirar los brazos sin mover los pies."]},
  kneepush:{g:"Pecho",eq:"Colchoneta",sec:"Tríceps y hombro anterior",cal:1,tips:["Rodillas apoyadas y cuerpo recto desde rodillas a cabeza.", "Manos bajo los hombros y abdomen firme.", "Ideal para empezar; pasa a flexiones normales cuando hagas 15 limpias."]},
  inclinepush:{g:"Pecho",eq:"Banco o barra baja",sec:"Tríceps y hombro anterior",cal:1,tips:["Manos en un banco o barra estable a la altura de la cadera.", "Cuerpo recto, baja el pecho hasta tocar el apoyo.", "Cuanto más alto el apoyo, más fácil: baja la altura para progresar."]},
  scapular:{g:"Espalda",eq:"Barra de dominadas",sec:"Trapecio y antebrazo",cal:1,tips:["Cuélgate con los brazos totalmente estirados.", "Sin doblar los codos, baja y sube los hombros acercando las escápulas.", "Es la base para conseguir tus primeras dominadas."]},
  widepullup:{g:"Espalda",eq:"Barra de dominadas",sec:"Bíceps y trapecio",cal:1,tips:["Agarre pronado más ancho que los hombros.", "Sube el pecho hacia la barra llevando los codos hacia abajo y atrás.", "Baja hasta estirar los brazos por completo."]},
  hangknee:{g:"Abdomen",eq:"Barra de dominadas",sec:"Flexores de cadera y antebrazo",cal:1,tips:["Cuélgate sin balancearte, hombros activos.", "Sube las rodillas hacia el pecho enrollando la pelvis.", "Baja despacio sin impulso para evitar el balanceo."]},
  hang:{g:"Espalda",eq:"Barra de dominadas",sec:"Dorsal y hombros",cal:1,tips:["Agarra la barra con las manos a la anchura de los hombros.", "Mantén los hombros activos, no los dejes caer.", "Aguanta 20-40 segundos; mejora mucho tu agarre."]},
  mountain:{g:"Abdomen",eq:"Peso corporal",sec:"Cuádriceps y hombros",cal:1,tips:["Posición de plancha alta con las manos bajo los hombros.", "Lleva una rodilla hacia el pecho y cambia de pierna rápido.", "Cadera baja y abdomen firme todo el rato."]},
  hollow:{g:"Abdomen",eq:"Colchoneta",sec:"Flexores de cadera",cal:1,tips:["Tumbado, lumbar pegada al suelo y brazos sobre la cabeza.", "Despega hombros y piernas formando una banana.", "Aguanta 20-30 segundos; si cuesta, dobla un poco las rodillas."]},
  bicycle:{g:"Abdomen",eq:"Colchoneta",sec:"Oblicuos",cal:1,tips:["Manos detrás de la cabeza sin tirar del cuello.", "Lleva el codo hacia la rodilla contraria alternando.", "Mueve la pierna estirada baja y controlada."]},
  vup:{g:"Abdomen",eq:"Colchoneta",sec:"Flexores de cadera",cal:1,tips:["Tumbado con brazos y piernas estirados.", "Sube a la vez el tronco y las piernas formando una V.", "Toca los pies con las manos y baja con control."]},
  deadbug:{g:"Abdomen",eq:"Colchoneta",sec:"Flexores de cadera",cal:1,tips:["Tumbado con brazos arriba y rodillas a 90 grados.", "Estira a la vez un brazo y la pierna contraria.", "Lumbar siempre pegada al suelo y respiración tranquila."]},
  plankup:{g:"Abdomen",eq:"Colchoneta",sec:"Hombros y tríceps",cal:1,tips:["Empieza sobre los antebrazos con el cuerpo recto.", "Sube a posición de flexión apoyando una mano y luego la otra.", "Baja del mismo modo e intercala el brazo que empieza."]},
  flutter:{g:"Abdomen",eq:"Colchoneta",sec:"Flexores de cadera",cal:1,tips:["Tumbado con manos bajo los glúteos y piernas estiradas.", "Sube y baja las piernas alternas con pequeños movimientos.", "Lumbar pegada al suelo; si se despega, sube más las piernas."]},
  situp:{g:"Abdomen",eq:"Colchoneta",sec:"Flexores de cadera",cal:1,tips:["Rodillas dobladas y pies apoyados en el suelo.", "Sube enrollando la espalda hasta sentarte con los brazos adelante.", "Baja despacio vértebra a vértebra."]},
  bwsquat:{g:"Pierna",eq:"Peso corporal",sec:"Glúteo y core",cal:1,tips:["Pies a la anchura de los hombros y brazos al frente.", "Baja con la espalda recta hasta que el muslo quede paralelo al suelo.", "Empuja con los talones y sube sin bloquear las rodillas."]},
  jumpsquat:{g:"Pierna",eq:"Peso corporal",sec:"Glúteo y gemelo",cal:1,tips:["Baja a una sentadilla con la espalda recta.", "Salta explosivo estirando del todo piernas y cadera.", "Aterriza suave amortiguando con las rodillas."]},
  pistol:{g:"Pierna",eq:"Peso corporal",sec:"Glúteo y core",cal:1,tips:["Apóyate en una pierna con la otra estirada al frente.", "Baja controlado con el talón siempre pegado al suelo.", "Si cuesta, agárrate a un soporte o siéntate en un banco."]},
  bwlunge:{g:"Pierna",eq:"Peso corporal",sec:"Glúteo e isquios",cal:1,tips:["De pie con los pies juntos y el tronco recto.", "Da un paso largo y baja hasta que ambas rodillas formen 90 grados.", "Empuja con el talón delantero para volver y cambia de pierna."]},
  wallsit:{g:"Pierna",eq:"Pared",sec:"Glúteo y gemelo",cal:1,tips:["Espalda pegada a la pared y muslos paralelos al suelo.", "Rodillas justo encima de los tobillos, no más adelante.", "Aguanta 30-60 segundos respirando con calma."]},
  bwcalf:{g:"Pierna",eq:"Escalón o suelo",sec:"Sóleo",cal:1,tips:["De pie con los pies a la anchura de la cadera.", "Sube de puntillas todo lo que puedas y aprieta arriba.", "Baja despacio; en un escalón trabajas más recorrido."]},
  singlebridge:{g:"Pierna",eq:"Colchoneta",sec:"Isquios y core",cal:1,tips:["Tumbado con un pie apoyado y la otra pierna estirada arriba.", "Sube la cadera apretando el glúteo hasta alinear hombro, cadera y rodilla.", "Baja sin apoyar del todo y cambia de pierna."]},
  nordic:{g:"Pierna",eq:"Anclaje para los pies",sec:"Glúteo y gemelo",cal:1,tips:["De rodillas sobre una superficie blanda con los pies anclados.", "Inclínate hacia delante con el cuerpo recto frenando con los isquios.", "Apóyate con las manos al llegar abajo y ayúdate para subir."]},
  burpee:{g:"Pierna",eq:"Peso corporal",sec:"Pecho, hombros y abdomen",cal:1,tips:["De pie, baja las manos al suelo y lleva los pies atrás hasta la plancha.", "Haz una flexión si puedes y vuelve a recoger los pies.", "Termina con un salto estirando el cuerpo."]},
  superman:{g:"Espalda",eq:"Colchoneta",sec:"Glúteo e isquios",cal:1,tips:["Tumbado boca abajo con los brazos estirados al frente.", "Eleva a la vez brazos y piernas del suelo sin forzar el cuello.", "Mantén 2 segundos arriba y baja con control."]},
  birddog:{g:"Espalda",eq:"Colchoneta",sec:"Glúteo y abdomen",cal:1,tips:["A cuatro apoyos con manos bajo hombros y rodillas bajo caderas.", "Estira un brazo y la pierna contraria sin girar la cadera.", "Mantén 2 segundos y alterna lado con la espalda neutra."]},
  lsit:{g:"Abdomen",eq:"Suelo o paralelas bajas",sec:"Tríceps y flexores de cadera",cal:1,tips:["Apoya las manos junto a las caderas con los brazos estirados.", "Empuja el suelo para elevar el cuerpo y estira las piernas al frente.", "Empieza con las rodillas flexionadas y aguanta 10-20 segundos."]},
  dbfly:{g:"Pecho",eq:"Mancuernas y banco",sec:"Hombro anterior",tips:["Tumbado con las mancuernas sobre el pecho y codos ligeramente flexionados.", "Abre los brazos en arco hasta sentir el estiramiento del pecho.", "Cierra como si abrazaras un árbol, sin chocar las pesas."]},
  closebench:{g:"Pecho",eq:"Barra y banco",sec:"Pecho y hombro anterior",tips:["Manos a la anchura de los hombros y codos pegados al cuerpo.", "Baja la barra a la parte baja del pecho con control.", "Empuja hasta estirar los brazos sin bloquear los codos."]},
  machfly:{g:"Pecho",eq:"Máquina de aperturas",sec:"Hombro anterior",tips:["Ajusta el asiento para que los brazos queden a la altura del pecho.", "Junta los brazos al frente apretando el pecho.", "Vuelve despacio sin dejar caer la pila de pesas."]},
  cablefly:{g:"Pecho",eq:"Poleas",sec:"Hombro anterior",tips:["De pie con una pierna adelantada y el tronco ligeramente inclinado.", "Lleva las manos juntas al frente en arco, apretando el pecho.", "Vuelve controlado hasta notar el estiramiento."]},
  tbar:{g:"Espalda",eq:"Barra en T o landmine",sec:"Bíceps y trapecio",tips:["Pecho hacia delante, espalda recta y rodillas flexionadas.", "Tira de la barra hacia el abdomen llevando los codos atrás.", "Baja con control sin redondear la espalda."]},
  pendlay:{g:"Espalda",eq:"Barra",sec:"Bíceps y trapecio",tips:["Barra en el suelo y torso casi paralelo al suelo.", "Tira explosivo hacia el abdomen sin impulsar con la cadera.", "Devuelve la barra al suelo en cada repetición."]},
  straightarm:{g:"Espalda",eq:"Polea alta",sec:"Tríceps y core",tips:["De pie frente a la polea alta con los brazos casi estirados.", "Lleva la barra hacia los muslos sin doblar los codos.", "Siente el dorsal y vuelve despacio arriba."]},
  sumodl:{g:"Espalda",eq:"Barra",sec:"Isquios, aductores y espalda",tips:["Pies muy separados con las puntas hacia fuera y agarre estrecho.", "Pecho arriba y rodillas abiertas sobre los pies.", "Empuja el suelo y lleva la cadera hacia delante al subir."]},
  reversefly:{g:"Hombro",eq:"Mancuernas",sec:"Trapecio y romboides",tips:["Inclinado con la espalda recta y las mancuernas colgando.", "Abre los brazos hacia los lados con los codos ligeramente flexionados.", "Aprieta los omóplatos arriba y baja sin impulso."]},
  hacksquat:{g:"Pierna",eq:"Máquina hack o Smith",sec:"Glúteo",tips:["Espalda y hombros apoyados, pies a la anchura de los hombros.", "Baja hasta que el muslo quede paralelo al suelo.", "Empuja con todo el pie sin bloquear las rodillas."]},
  revlunge:{g:"Pierna",eq:"Mancuernas",sec:"Glúteo e isquios",tips:["De pie con una mancuerna en cada mano.", "Da un paso atrás y baja hasta doblar ambas rodillas.", "Empuja con la pierna delantera para volver al inicio."]},
  sumosquat:{g:"Pierna",eq:"Mancuerna o kettlebell",sec:"Aductores y cuádriceps",tips:["Pies muy abiertos con las puntas hacia fuera.", "Baja con el tronco recto y las rodillas siguiendo los pies.", "Sube apretando glúteos y aductores."]},
  stiffdl:{g:"Pierna",eq:"Barra",sec:"Glúteo y espalda baja",tips:["Piernas casi estiradas con una ligera flexión de rodilla.", "Empuja la cadera atrás y baja la barra pegada a las piernas.", "Siente el estiramiento de isquios y sube apretando glúteos."]},
  pullthrough:{g:"Pierna",eq:"Polea baja con cuerda",sec:"Isquios y espalda baja",tips:["De espaldas a la polea con la cuerda entre las piernas.", "Lleva la cadera atrás con la espalda recta.", "Empuja la cadera hacia delante apretando el glúteo."]},
  singlerdl:{g:"Pierna",eq:"Mancuerna",sec:"Glúteo y core",tips:["Apóyate en una pierna con la rodilla ligeramente flexionada.", "Inclina el tronco llevando la otra pierna atrás en línea.", "Vuelve arriba sin girar la cadera."]},
  arnold:{g:"Hombro",eq:"Mancuernas",sec:"Tríceps y deltoides anterior",tips:["Sentado con las mancuernas delante del pecho y las palmas hacia ti.", "Gira las palmas hacia delante mientras empujas hacia arriba.", "Baja girando de nuevo hasta la posición inicial."]},
  cablelateral:{g:"Hombro",eq:"Polea baja",sec:"Trapecio",tips:["De lado a la polea y agarra el asa con la mano lejana.", "Sube el brazo hacia el lado hasta la altura del hombro.", "Baja despacio manteniendo la tensión."]},
  frontplate:{g:"Hombro",eq:"Disco",sec:"Pecho superior",tips:["Sujeta el disco con ambas manos a la altura de los muslos.", "Elévalo al frente hasta la altura de los ojos con los brazos casi rectos.", "Baja controlado sin balancear el cuerpo."]},
  barbellshrug:{g:"Espalda",eq:"Barra",sec:"Antebrazo",tips:["De pie con la barra al frente y los brazos estirados.", "Sube los hombros hacia las orejas sin girarlos.", "Mantén un segundo arriba y baja despacio."]},
  hammer:{g:"Brazos",eq:"Mancuernas",sec:"Antebrazo",tips:["De pie con las palmas mirándose entre sí.", "Sube las mancuernas sin mover los codos.", "Baja despacio hasta estirar los brazos."]},
  concentration:{g:"Brazos",eq:"Mancuerna",sec:"Antebrazo",tips:["Sentado con el codo apoyado en la cara interna del muslo.", "Flexiona el brazo apretando el bíceps arriba.", "Baja lento sin ayudarte del cuerpo."]},
  cablecurl:{g:"Brazos",eq:"Polea baja",sec:"Antebrazo",tips:["De pie frente a la polea baja con la barra o cuerda.", "Flexiona los codos sin moverlos del costado.", "La polea mantiene tensión constante: baja controlado."]},
  ropepush:{g:"Brazos",eq:"Polea alta con cuerda",sec:"Antebrazo",tips:["Codos pegados al cuerpo y agarre de la cuerda.", "Empuja hacia abajo separando las puntas de la cuerda al final.", "Sube despacio sin despegar los codos."]},
  reversecurl:{g:"Brazos",eq:"Barra",sec:"Antebrazo",tips:["Agarre con las palmas hacia abajo, manos a la anchura de los hombros.", "Sube la barra sin mover los codos.", "Trabaja antebrazo y braquial: usa menos peso que en el curl normal."]},
  wristcurl:{g:"Brazos",eq:"Mancuerna o barra",sec:"Antebrazo",tips:["Sentado con los antebrazos apoyados en los muslos y las palmas arriba.", "Deja caer la pesa hasta los dedos y flexiona la muñeca hacia arriba.", "Movimiento corto y controlado, muchas repeticiones."]},
  cablecrunch:{g:"Abdomen",eq:"Polea alta con cuerda",sec:"Oblicuos",tips:["De rodillas con la cuerda a ambos lados de la cabeza.", "Enrolla el tronco llevando los codos hacia las rodillas.", "Mueve la columna, no solo la cadera."]},
  abwheel:{g:"Abdomen",eq:"Rueda abdominal",sec:"Hombros y dorsal",tips:["De rodillas con las manos en la rueda y la espalda neutra.", "Rueda hacia delante hasta donde mantengas la zona lumbar firme.", "Vuelve apretando el abdomen sin hundir la cadera."]},
  reversecrunch:{g:"Abdomen",eq:"Colchoneta",sec:"Flexores de cadera",tips:["Tumbado con las rodillas dobladas sobre las caderas.", "Sube la pelvis hacia el pecho enrollando la zona lumbar.", "Baja despacio sin dejar caer las piernas."]},
  woodchop:{g:"Abdomen",eq:"Polea alta",sec:"Oblicuos y hombros",tips:["De pie de lado con el asa alta y ambas manos agarradas.", "Tira en diagonal hacia la cadera contraria girando el tronco.", "Pivota los pies y vuelve controlado."]},
  dipsmach:{g:"Brazos",eq:"Máquina de fondos",sec:"Pecho y hombro anterior",tips:["Ajusta el asiento y agarra las asas a la altura de las caderas.", "Empuja hacia abajo estirando los codos.", "Sube despacio sin encogerte de hombros."]}
};
var NEWX={
  pullup:{n:'Dominadas',m:'Dorsal',k:0,bw:1},
  dips:{n:'Fondos en paralelas',m:'Pecho',k:0,bw:1},
  pushup:{n:'Flexiones',m:'Pecho',k:0,bw:1},
  crunch:{n:'Crunch abdominal',m:'Abdomen',k:0,bw:1},
  legraise:{n:'Elevación de piernas colgado',m:'Abdomen',k:0,bw:1},
  lunge:{n:'Zancadas con mancuernas',m:'Cuádriceps',k:.2},
  legext:{n:'Extensión de cuádriceps',m:'Cuádriceps',k:.5},
  shrug:{n:'Encogimientos de hombros',m:'Trapecio',k:.4},
  backext:{n:'Hiperextensiones',m:'Espalda baja',k:0,bw:1},
  seatedrow:{n:'Remo en polea baja',m:'Espalda',k:.5},
  chestpress:{n:'Press de pecho en máquina',m:'Pecho',k:.6},
  kickback:{n:'Patada de glúteo en polea',m:'Glúteo',k:.15},
  dbbench:{n:'Press banca con mancuernas',m:'Pecho',k:.25},
  inclinebb:{n:'Press inclinado con barra',m:'Pecho',k:.45},
  pullover:{n:'Pullover con mancuerna',m:'Pecho',k:.25},
  dbrow:{n:'Remo con mancuerna a una mano',m:'Espalda',k:.3},
  chinup:{n:'Dominadas supinas',m:'Dorsal',k:0,bw:1},
  invrow:{n:'Remo invertido',m:'Espalda',k:0,bw:1},
  closegrip:{n:'Jalón con agarre estrecho',m:'Espalda',k:.45},
  dbohp:{n:'Press de hombros con mancuernas',m:'Hombro',k:.17},
  upright:{n:'Remo al mentón',m:'Hombro',k:.3},
  frontraise:{n:'Elevaciones frontales',m:'Hombro',k:.1},
  machshoulder:{n:'Press de hombros en máquina',m:'Hombro',k:.4},
  barbellcurl:{n:'Curl con barra',m:'Bíceps',k:.3},
  inclinecurl:{n:'Curl inclinado con mancuernas',m:'Bíceps',k:.12},
  preacher:{n:'Curl predicador',m:'Bíceps',k:.25},
  overheadtri:{n:'Extensión de tríceps sobre la cabeza',m:'Tríceps',k:.2},
  skullcrusher:{n:'Press francés',m:'Tríceps',k:.25},
  tricepskick:{n:'Patada de tríceps',m:'Tríceps',k:.08},
  benchdip:{n:'Fondos en banco',m:'Tríceps',k:0,bw:1},
  frontsquat:{n:'Sentadilla frontal',m:'Pierna',k:.6},
  goblet:{n:'Sentadilla goblet',m:'Cuádriceps',k:.25},
  smith:{n:'Sentadilla en máquina Smith',m:'Pierna',k:.7},
  stepup:{n:'Subida al cajón',m:'Cuádriceps',k:.15},
  bulgarian:{n:'Sentadilla búlgara',m:'Cuádriceps',k:.15},
  glutebridge:{n:'Puente de glúteo',m:'Glúteo',k:0,bw:1},
  goodmorning:{n:'Buenos días con barra',m:'Isquios',k:.4},
  seatedcalf:{n:'Gemelos sentado',m:'Gemelo',k:.6},
  seatedlegcurl:{n:'Curl femoral sentado',m:'Isquios',k:.3},
  kbswing:{n:'Swing con kettlebell',m:'Glúteo',k:.25},
  plank:{n:'Plancha',m:'Abdomen',k:0,bw:1},
  lyingraise:{n:'Elevación de piernas tumbado',m:'Abdomen',k:0,bw:1},
  diamondpush:{n:"Flexiones diamante",m:"Tríceps",k:0,bw:1},
  widepush:{n:"Flexiones anchas",m:"Pecho",k:0,bw:1},
  declinepush:{n:"Flexiones declinadas",m:"Pecho",k:0,bw:1},
  pikepush:{n:"Flexiones pike",m:"Hombro",k:0,bw:1},
  kneepush:{n:"Flexiones de rodillas",m:"Pecho",k:0,bw:1},
  inclinepush:{n:"Flexiones inclinadas",m:"Pecho",k:0,bw:1},
  scapular:{n:"Dominada escapular",m:"Dorsal",k:0,bw:1},
  widepullup:{n:"Dominadas agarre ancho",m:"Dorsal",k:0,bw:1},
  hangknee:{n:"Rodillas al pecho colgado",m:"Abdomen",k:0,bw:1},
  hang:{n:"Colgado en barra",m:"Antebrazo",k:0,bw:1},
  mountain:{n:"Escaladores",m:"Abdomen",k:0,bw:1},
  hollow:{n:"Hollow body",m:"Abdomen",k:0,bw:1},
  bicycle:{n:"Bicicleta abdominal",m:"Abdomen",k:0,bw:1},
  vup:{n:"Abdominales en V",m:"Abdomen",k:0,bw:1},
  deadbug:{n:"Bicho muerto",m:"Abdomen",k:0,bw:1},
  plankup:{n:"Plancha dinámica",m:"Abdomen",k:0,bw:1},
  flutter:{n:"Patadas alternas",m:"Abdomen",k:0,bw:1},
  situp:{n:"Abdominales completos",m:"Abdomen",k:0,bw:1},
  bwsquat:{n:"Sentadilla con peso corporal",m:"Cuádriceps",k:0,bw:1},
  jumpsquat:{n:"Sentadilla con salto",m:"Cuádriceps",k:0,bw:1},
  pistol:{n:"Sentadilla pistol",m:"Cuádriceps",k:0,bw:1},
  bwlunge:{n:"Zancadas sin peso",m:"Cuádriceps",k:0,bw:1},
  wallsit:{n:"Sentadilla isométrica en pared",m:"Cuádriceps",k:0,bw:1},
  bwcalf:{n:"Elevación de talones sin peso",m:"Gemelo",k:0,bw:1},
  singlebridge:{n:"Puente de glúteo a una pierna",m:"Glúteo",k:0,bw:1},
  nordic:{n:"Curl nórdico",m:"Isquios",k:0,bw:1},
  burpee:{n:"Burpees",m:"Cuádriceps",k:0,bw:1},
  superman:{n:"Superman",m:"Espalda baja",k:0,bw:1},
  birddog:{n:"Perro-pájaro",m:"Espalda baja",k:0,bw:1},
  lsit:{n:"L-sit",m:"Abdomen",k:0,bw:1},
  dbfly:{n:"Aperturas con mancuernas",m:"Pecho",k:0.2},
  closebench:{n:"Press banca agarre cerrado",m:"Tríceps",k:0.7,main:1},
  machfly:{n:"Contractora (pec deck)",m:"Pecho",k:0.5},
  cablefly:{n:"Cruce de poleas",m:"Pecho",k:0.25},
  tbar:{n:"Remo en T",m:"Espalda",k:0.6},
  pendlay:{n:"Remo Pendlay",m:"Espalda",k:0.7,main:1},
  straightarm:{n:"Jalón con brazos rectos",m:"Dorsal",k:0.3},
  sumodl:{n:"Peso muerto sumo",m:"Glúteo",k:1.3,main:1},
  reversefly:{n:"Pájaros con mancuernas",m:"Hombro posterior",k:0.1},
  hacksquat:{n:"Sentadilla hack",m:"Cuádriceps",k:1,main:1},
  revlunge:{n:"Zancada hacia atrás",m:"Cuádriceps",k:0.25},
  sumosquat:{n:"Sentadilla sumo",m:"Glúteo",k:0.3},
  stiffdl:{n:"Peso muerto con piernas rígidas",m:"Isquios",k:0.8,main:1},
  pullthrough:{n:"Pull-through en polea",m:"Glúteo",k:0.4},
  singlerdl:{n:"Peso muerto a una pierna",m:"Isquios",k:0.3},
  arnold:{n:"Press Arnold",m:"Hombro",k:0.25},
  cablelateral:{n:"Elevación lateral en polea",m:"Hombro",k:0.1},
  frontplate:{n:"Elevación frontal con disco",m:"Hombro",k:0.2},
  barbellshrug:{n:"Encogimientos con barra",m:"Trapecio",k:0.9},
  hammer:{n:"Curl martillo",m:"Bíceps",k:0.2},
  concentration:{n:"Curl concentrado",m:"Bíceps",k:0.15},
  cablecurl:{n:"Curl en polea baja",m:"Bíceps",k:0.3},
  ropepush:{n:"Extensión de tríceps con cuerda",m:"Tríceps",k:0.35},
  reversecurl:{n:"Curl inverso",m:"Bíceps",k:0.3},
  wristcurl:{n:"Curl de muñeca",m:"Bíceps",k:0.2},
  cablecrunch:{n:"Crunch en polea",m:"Abdomen",k:0.4},
  abwheel:{n:"Rueda abdominal",m:"Abdomen",k:0,bw:1},
  reversecrunch:{n:"Crunch inverso",m:"Abdomen",k:0,bw:1},
  woodchop:{n:"Leñador en polea",m:"Abdomen",k:0.25},
  dipsmach:{n:"Fondos en máquina",m:"Tríceps",k:0.6}
};
Object.keys(NEWX).forEach(function(id){EX[id]=NEWX[id]});
['pullup','chinup','dips','pushup','crunch','legraise','backext','invrow','benchdip','glutebridge','plank','lyingraise'].forEach(function(id){if(INFO[id]) INFO[id].cal=1});
function inPlan(id){return getPlan().some(function(d){return d.e.indexOf(id)>=0})}

/* ---------- piezas de dibujo ---------- */
function TB(x1,y1,x2,y2,w,acc){
  return '<line class="tbo" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" style="stroke-width:'+(w+2)+'"/>'+
    '<line class="'+(acc?'tba':'tb')+'" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" style="stroke-width:'+w+'"/>';
}
function PL(x1,y1,x2,y2,w){
  return '<line class="tbo" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" style="stroke-width:'+(w+2)+'"/>'+
    '<line class="padl" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" style="stroke-width:'+w+'"/>';
}
function pad(x,y,w,h,rot){
  return '<rect class="pad" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(Math.min(w,h)/2.4)+'"'+(rot?' transform="rotate('+rot+' '+(x+w/2)+' '+(y+h/2)+')"':'')+'/>';
}
function plt(x,y,r){return '<circle class="wt" cx="'+x+'" cy="'+y+'" r="'+r+'"/><circle class="wti" cx="'+x+'" cy="'+y+'" r="'+(r*0.28)+'"/>'}
function dmb(x,y){return '<rect class="wt" x="'+(x-6)+'" y="'+(y-3.6)+'" width="12" height="7.2" rx="2.4"/>'}
function hnd(x,y){return '<rect class="wt" x="'+(x-4)+'" y="'+(y-2)+'" width="8" height="4" rx="2"/>'}
function pul(x,y){return '<circle class="wti" cx="'+x+'" cy="'+y+'" r="3.4" style="stroke:var(--ink);stroke-width:1"/>'}
function cab(x1,y1,x2,y2){return '<line class="cab" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'"/>'}
function stack(x,y,w,n){
  var o='',i;
  for(i=0;i<n;i++) o+='<rect class="stk" x="'+x+'" y="'+(y+i*3.4)+'" width="'+w+'" height="3" rx="1"/>';
  return o;
}
function mk(base,extra){var o={},k;for(k in base)o[k]=base[k];for(k in extra)o[k]=extra[k];return o}

var BN=pad(6,84,76,7)+TB(14,91,14,108,3)+TB(72,91,72,108,3)+TB(10,108,10,50,3.4,1)+pad(6,48,10,4);
var BN2=pad(2,84,28,7)+TB(8,91,8,108,3)+TB(22,91,22,108,3);
var BNL=pad(4,84,70,6)+TB(10,90,10,108,3)+TB(62,90,62,108,3)+TB(70,90,76,108,3,1);
var INC=PL(36,92,19,60,9)+pad(32,91,38,6)+TB(40,97,34,108,3)+TB(58,97,60,108,3);
var PD=pad(44,92,26,6)+TB(56,98,56,108,3)+TB(92,108,92,4,3.4,1)+TB(59,4,92,4,3.4,1)+pul(59,4)+stack(93,14,7,17);
var LP=TB(28,108,92,60,3.4,1)+PL(36,96,14,66,9);
var STEP=pad(30,104,44,4);
var RACK=TB(90,108,90,30,3.4,1)+pad(85,34,6,4);
var PUSHF=TB(90,108,90,4,3.4,1)+TB(66,4,90,4,3.4,1)+pul(66,4)+stack(92,12,8,18);
var PUF=TB(14,108,14,10,3.4,1)+TB(86,108,86,10,3.4,1)+TB(14,10,86,10,3.4,0);
var PUF2=TB(14,108,14,6,3.4,1)+TB(86,108,86,6,3.4,1)+TB(14,6,86,6,3.4,0);
var DIP=TB(34,63,34,108,3,1)+TB(74,63,74,108,3,1)+TB(30,63,78,63,3.2,0);
var MAT=pad(2,104,96,4);
var LEXT=pad(30,90,40,6)+PL(28,84,25,48,8)+TB(44,96,44,108,3,1)+TB(13,108,13,40,3,1)+stack(2,40,9,18);
var BEX=pad(36,64,22,7,-25)+TB(52,76,58,108,3,1)+TB(10,84,34,108,3,1)+pad(3,76,9,9);
var SR=pad(14,94,30,6)+TB(24,100,24,108,3)+TB(78,108,78,84,3,1)+pad(75,80,6,10);
var CP=pad(24,92,30,6)+PL(27,84,27,44,9)+TB(40,98,40,108,3,1)+TB(14,108,14,34,3.4,1)+stack(2,38,9,16);
var KB=TB(94,108,94,24,3.4,1)+pad(86,50,10,5)+pul(94,104);
var BNb=pad(6,84,76,7)+TB(14,91,14,108,3)+TB(72,91,72,108,3);
var BNo=pad(14,84,76,7)+TB(22,91,22,108,3)+TB(80,91,80,108,3);
var SB=pad(24,92,32,6)+PL(28,86,28,46,8)+TB(40,98,40,108,3,1);
var MS=pad(26,92,30,6)+PL(30,86,30,46,8)+TB(40,98,40,108,3,1)+TB(14,108,14,24,3.4,1)+stack(2,30,9,18);
var PRE=PL(52,62,66,92,9)+TB(66,92,66,108,3,1)+pad(24,92,24,6)+TB(34,98,34,108,3);
var BNR=pad(56,84,40,7)+TB(62,91,62,108,3)+TB(90,91,90,108,3);
var BNK=pad(66,84,30,6)+TB(72,90,72,108,3)+TB(90,90,90,108,3);
var BDB=pad(10,70,30,7)+TB(16,77,16,108,3)+TB(34,77,34,108,3);
var BOX=pad(56,98,40,10);
var BULG=pad(0,84,28,6)+TB(6,90,6,108,3)+TB(22,90,22,108,3);
var INVR=TB(32,108,32,62,3.4,1)+TB(32,62,6,62,3.4,0);
var SMITH=TB(88,108,88,10,3.4,1)+TB(97,108,97,10,3.4,1)+TB(88,24,97,24,2,0);
var SCALF=pad(22,92,26,6)+pad(50,104,26,4)+TB(34,98,34,108,3)+TB(62,74,90,68,3,1)+TB(90,68,90,108,3.4,1);
var SLC=pad(30,90,40,6)+PL(28,84,25,48,8)+TB(44,96,44,108,3,1)+TB(13,108,13,40,3,1)+stack(2,40,9,18);
function kb(x,y){return '<circle class="wt" cx="'+x+'" cy="'+y+'" r="7"/><path class="cab" d="M'+(x-4.5)+','+(y-5.5)+' A5,5 0 0 1 '+(x+4.5)+','+(y-5.5)+'" style="stroke-width:2.2"/>'}
var STAND={h:[50,18],s:[50,31],p:[50,60],k:[51,83],f:[50,106]};
var BOXL=pad(0,92,24,16);
var INCB=pad(72,86,28,6)+TB(78,92,78,108,3)+TB(96,92,96,108,3);
var WALLB='<rect class="pad" x="0" y="8" width="7" height="100" rx="1.5"/>';
var NORS=pad(0,98,14,10)+TB(4,98,4,108,3);
var PARAL=pad(34,92,12,16);
var PUFW=TB(14,108,14,6,3.4,1)+TB(86,108,86,6,3.4,1)+TB(14,6,86,6,3.4,0);

var POSES={
  bench:[
    {h:[16,72],s:[26,76],p:[56,76],k:[78,78],f:[78,106],e:[27,60],w:[27,46],eq:BN,wt:plt(27,45,8),hl:['chest','delts','arm']},
    {h:[16,72],s:[26,76],p:[56,76],k:[78,78],f:[78,106],e:[36,80],w:[27,64],eq:BN,wt:plt(27,62,8),hl:['chest','delts','arm']}],
  squat:[
    {h:[50,17],s:[50,30],p:[50,60],k:[53,83],f:[50,106],e:[44,42],w:[47,30],eq:RACK,wt:plt(43,30,7),hl:['quad','glute']},
    {h:[32,45],s:[34,56],p:[41,86],k:[64,86],f:[58,107],e:[40,62],w:[35,54],eq:RACK,wt:plt(29,55,7),hl:['quad','glute']}],
  deadlift:[
    {h:[73,64],s:[64,68],p:[38,78],k:[58,88],f:[50,107],e:[64,82],w:[64,96],wt:plt(64,97,10),hl:['back','glute','ham']},
    mk(STAND,{e:[50,45],w:[51,60],wt:plt(52,62,9),hl:['back','glute','ham']})],
  ohp:[
    mk(STAND,{e:[58,46],w:[54,32],wt:plt(54,30,7),hl:['delts','arm']}),
    mk(STAND,{h:[46,20],e:[54,19],w:[53,7],wt:plt(53,8,7),hl:['delts','arm']})],
  row:[
    {h:[76,48],s:[68,54],p:[42,66],k:[54,86],f:[46,107],e:[68,69],w:[68,84],wt:plt(68,86,9),hl:['back','arm']},
    {h:[76,48],s:[68,54],p:[42,66],k:[54,86],f:[46,107],e:[56,62],w:[62,74],wt:plt(62,74,9),hl:['back','arm']}],
  incline:[
    {h:[24,53],s:[29,62],p:[44,88],k:[67,82],f:[66,106],e:[33,48],w:[34,33],eq:INC,wt:dmb(34,31),hl:['chest','delts']},
    {h:[24,53],s:[29,62],p:[44,88],k:[67,82],f:[66,106],e:[42,68],w:[34,60],eq:INC,wt:dmb(34,58),hl:['chest','delts']}],
  pulldown:[
    {h:[53,47],s:[54,58],p:[58,88],k:[80,84],f:[82,106],e:[57,43],w:[59,29],eq:PD+cab(59,29,59,4),wt:hnd(59,29)+pad(66,74,18,6),hl:['back','arm']},
    {h:[53,47],s:[54,58],p:[58,88],k:[80,84],f:[82,106],e:[50,72],w:[60,60],eq:PD+cab(60,60,59,4),wt:hnd(60,60)+pad(66,74,18,6),hl:['back','arm']}],
  legpress:[
    {h:[9,64],s:[16,72],p:[34,92],k:[56,78],f:[62,98],ft:[3,3],e:[24,81],w:[31,88],eq:LP,wt:PL(64,88,72,102,6),hl:['quad','glute']},
    {h:[9,64],s:[16,72],p:[34,92],k:[52,78],f:[71,64],ft:[3,3],e:[24,81],w:[31,88],eq:LP,wt:PL(73,56,81,70,6),hl:['quad','glute']}],
  rdl:[
    mk(STAND,{e:[50,45],w:[51,60],wt:plt(52,62,9),hl:['ham','glute','back']}),
    {h:[70,52],s:[62,56],p:[34,70],k:[54,85],f:[50,107],e:[62,71],w:[62,86],wt:plt(62,86,9),hl:['ham','glute','back']}],
  curl:[
    mk(STAND,{e:[50,46],w:[51,60],wt:dmb(51,62),hl:['arm','fore']}),
    mk(STAND,{e:[50,46],w:[62,37],wt:dmb(62,36),hl:['arm','fore']})],
  pushdown:[
    mk(STAND,{e:[52,45],w:[63,37],eq:PUSHF+cab(63,37,66,4),wt:hnd(63,37),hl:['arm']}),
    mk(STAND,{e:[52,45],w:[54,60],eq:PUSHF+cab(54,60,66,4),wt:hnd(54,60),hl:['arm']})],
  lateral:[
    mk(STAND,{e:[50,46],w:[51,60],wt:dmb(51,62),hl:['delts']}),
    mk(STAND,{e:[64,33],w:[79,35],wt:dmb(79,35),hl:['delts']})],
  calf:[
    {h:[50,16],s:[50,29],p:[50,58],k:[50,80],f:[50,102],ft:[9,0],e:[50,43],w:[50,57],eq:STEP,wt:dmb(50,59),hl:['calf']},
    {h:[50,12],s:[50,25],p:[50,54],k:[50,76],f:[50,98],ft:[9,6],e:[50,39],w:[50,53],eq:STEP,wt:dmb(50,55),hl:['calf']}],
  thrust:[
    {h:[13,72],s:[22,77],p:[46,98],k:[62,84],f:[64,106],ft:[6,0],eq:BN2,wt:plt(46,95,9),hl:['glute','ham']},
    {h:[13,72],s:[22,77],p:[50,80],k:[70,80],f:[70,106],ft:[6,0],eq:BN2,wt:plt(50,77,9),hl:['glute','ham']}],
  face:[
    mk(STAND,{e:[65,31],w:[80,30],eq:TB(98,108,98,18,3.4,1)+pul(97,28)+cab(80,30,97,28),wt:hnd(80,30),hl:['delts','trap']}),
    mk(STAND,{e:[46,42],w:[58,29],eq:TB(98,108,98,18,3.4,1)+pul(97,28)+cab(58,29,97,28),wt:hnd(58,29),hl:['delts','trap']})],
  legcurl:[
    {fd:-1,h:[8,72],s:[16,76],p:[44,76],k:[66,76],f:[88,76],ft:[3,0],eq:BNL,wt:pad(83,70,7,12),hl:['ham']},
    {fd:-1,h:[8,72],s:[16,76],p:[44,76],k:[66,76],f:[70,54],ft:[3,-3],eq:BNL,wt:pad(66,49,7,12),hl:['ham']}],
  pullup:[
    {h:[56,30],s:[50,40],p:[50,70],k:[56,92],f:[48,104],ft:[5,3],e:[50,25],w:[50,10],eq:PUF,hl:['back','arm']},
    {h:[54,17],s:[50,26],p:[50,56],k:[54,78],f:[46,92],ft:[5,3],e:[43,21],w:[50,10],eq:PUF,hl:['back','arm']}],
  dips:[
    {h:[52,22],s:[48,32],p:[46,62],k:[46,86],f:[34,98],ft:[-4,2],e:[48,47],w:[48,62],eq:DIP,hl:['chest','arm']},
    {h:[52,36],s:[48,46],p:[46,76],k:[46,100],f:[30,106],ft:[-4,1],e:[38,54],w:[48,62],eq:DIP,hl:['chest','arm']}],
  pushup:[
    {h:[90,70],s:[80,76],p:[52,88],k:[30,97],f:[10,106],ft:[-2,2],e:[80,91],w:[80,106],hl:['chest','arm','abs']},
    {h:[92,92],s:[80,96],p:[51,100],k:[28,103],f:[8,106],ft:[-2,1],e:[66,98],w:[80,106],hl:['chest','arm','abs']}],
  crunch:[
    {h:[12,98],s:[22,100],p:[52,100],k:[68,82],f:[82,100],ft:[6,0],e:[16,88],w:[10,94],eq:MAT,hl:['abs']},
    {h:[20,80],s:[27,88],p:[52,100],k:[68,82],f:[82,100],ft:[6,0],e:[26,74],w:[18,80],eq:MAT,hl:['abs']}],
  legraise:[
    {h:[54,26],s:[50,36],p:[50,66],k:[51,86],f:[50,106],ft:[5,2],e:[50,21],w:[50,6],eq:PUF2,hl:['abs']},
    {h:[54,26],s:[50,36],p:[50,66],k:[74,68],f:[96,70],ft:[3,0],e:[50,21],w:[50,6],eq:PUF2,hl:['abs']}],
  lunge:[
    mk(STAND,{e:[50,45],w:[51,60],wt:dmb(51,62),hl:['quad','glute']}),
    {h:[50,34],s:[48,46],p:[48,76],k:[70,86],f:[70,107],k2:[34,98],f2:[14,104],e:[48,60],w:[48,74],wt:dmb(48,76),hl:['quad','glute']}],
  legext:[
    {h:[32,42],s:[34,54],p:[40,84],k:[62,82],f:[62,104],ft:[3,2],e:[40,66],w:[46,77],eq:LEXT,wt:pad(57,95,11,7),hl:['quad']},
    {h:[32,42],s:[34,54],p:[40,84],k:[62,82],f:[84,76],ft:[3,-2],e:[40,66],w:[46,77],eq:LEXT,wt:pad(74,73,11,7),hl:['quad']}],
  shrug:[
    mk(STAND,{e:[50,46],w:[51,60],wt:dmb(51,62),hl:['trap']}),
    {h:[50,16],s:[50,27],p:[50,60],k:[51,83],f:[50,106],e:[50,42],w:[51,56],wt:dmb(51,58),hl:['trap']}],
  backext:[
    {h:[66,94],s:[60,86],p:[46,62],k:[26,70],f:[8,80],ft:[-4,2],e:[58,92],w:[52,88],eq:BEX,hl:['back','glute','ham']},
    {h:[82,45],s:[73,49],p:[46,62],k:[26,70],f:[8,80],ft:[-4,2],e:[66,56],w:[58,52],eq:BEX,hl:['back','glute','ham']}],
  seatedrow:[
    {h:[50,53],s:[46,64],p:[28,90],k:[52,84],f:[74,92],ft:[3,0],e:[60,70],w:[74,74],eq:SR+cab(74,74,96,80)+pul(96,80),wt:hnd(74,74),hl:['back','arm']},
    {h:[33,48],s:[34,60],p:[28,90],k:[52,84],f:[74,92],ft:[3,0],e:[24,72],w:[40,76],eq:SR+cab(40,76,96,80)+pul(96,80),wt:hnd(40,76),hl:['back','arm']}],
  chestpress:[
    {h:[34,46],s:[34,58],p:[36,88],k:[58,86],f:[60,106],e:[44,70],w:[54,60],eq:CP+TB(54,60,29,56,2.6,0),wt:hnd(54,60),hl:['chest','arm','delts']},
    {h:[34,46],s:[34,58],p:[36,88],k:[58,86],f:[60,106],e:[50,58],w:[64,58],eq:CP+TB(64,58,29,56,2.6,0),wt:hnd(64,58),hl:['chest','arm','delts']}],
  kickback:[
    {h:[63,28],s:[58,38],p:[48,66],k:[54,88],f:[52,107],k2:[50,88],f2:[50,107],e:[70,46],w:[82,54],eq:KB+cab(52,104,94,104),hl:['glute','ham']},
    {h:[63,28],s:[58,38],p:[48,66],k:[30,84],f:[10,92],ft:[-3,2],k2:[50,88],f2:[50,107],e:[70,46],w:[82,54],eq:KB+cab(10,92,94,104),hl:['glute','ham']}],
  dbbench:[
    {h:[16,72],s:[26,76],p:[56,76],k:[78,78],f:[78,106],e:[27,60],w:[27,46],eq:BNb,wt:dmb(27,45),hl:['chest','delts','arm']},
    {h:[16,72],s:[26,76],p:[56,76],k:[78,78],f:[78,106],e:[36,80],w:[27,64],eq:BNb,wt:dmb(27,62),hl:['chest','delts','arm']}],
  inclinebb:[
    {h:[24,53],s:[29,62],p:[44,88],k:[67,82],f:[66,106],e:[33,48],w:[34,33],eq:INC,wt:plt(34,31,8),hl:['chest','delts']},
    {h:[24,53],s:[29,62],p:[44,88],k:[67,82],f:[66,106],e:[42,68],w:[34,60],eq:INC,wt:plt(34,58,8),hl:['chest','delts']}],
  pullover:[
    {h:[26,72],s:[36,76],p:[66,76],k:[88,78],f:[88,106],ft:[6,0],e:[37,60],w:[37,46],eq:BNo,wt:dmb(37,45),hl:['chest','back']},
    {h:[26,72],s:[36,76],p:[66,76],k:[88,78],f:[88,106],ft:[6,0],e:[22,72],w:[7,70],eq:BNo,wt:dmb(7,70),hl:['chest','back']}],
  dbrow:[
    {h:[62,56],s:[52,58],p:[22,62],k:[30,84],f:[26,106],e:[52,73],w:[52,88],e2:[60,70],w2:[68,83],eq:BNR,wt:dmb(52,90),hl:['back','arm']},
    {h:[62,56],s:[52,58],p:[22,62],k:[30,84],f:[26,106],e:[38,62],w:[44,74],e2:[60,70],w2:[68,83],eq:BNR,wt:dmb(44,76),hl:['back','arm']}],
  invrow:[
    {h:[8,88],s:[18,92],p:[48,97],k:[72,100],f:[94,103],ft:[3,0],e:[18,77],w:[18,62],eq:INVR,hl:['back','arm']},
    {h:[8,72],s:[18,76],p:[46,88],k:[70,96],f:[92,103],ft:[3,0],e:[28,70],w:[18,62],eq:INVR,hl:['back','arm']}],
  dbohp:[
    {h:[38,46],s:[38,58],p:[40,88],k:[62,86],f:[62,106],e:[46,70],w:[44,56],eq:SB,wt:dmb(44,54),hl:['delts','arm']},
    {h:[38,46],s:[38,58],p:[40,88],k:[62,86],f:[62,106],e:[40,43],w:[40,28],eq:SB,wt:dmb(40,26),hl:['delts','arm']}],
  upright:[
    mk(STAND,{e:[50,46],w:[52,60],wt:plt(52,62,8),hl:['delts','trap','arm']}),
    mk(STAND,{e:[60,26],w:[53,38],wt:plt(53,38,7),hl:['delts','trap','arm']})],
  machshoulder:[
    {h:[38,46],s:[38,58],p:[40,88],k:[62,86],f:[62,106],e:[46,68],w:[50,56],eq:MS+TB(50,56,22,40,2.6,0),wt:hnd(50,56),hl:['delts','arm']},
    {h:[38,46],s:[38,58],p:[40,88],k:[62,86],f:[62,106],e:[46,46],w:[48,32],eq:MS+TB(48,32,22,40,2.6,0),wt:hnd(48,32),hl:['delts','arm']}],
  barbellcurl:[
    mk(STAND,{e:[50,46],w:[51,60],wt:plt(51,62,7),hl:['arm','fore']}),
    mk(STAND,{e:[50,46],w:[62,37],wt:plt(62,36,7),hl:['arm','fore']})],
  inclinecurl:[
    {h:[24,53],s:[29,62],p:[44,88],k:[67,82],f:[66,106],e:[30,77],w:[31,92],eq:INC,wt:dmb(31,94),hl:['arm','fore']},
    {h:[24,53],s:[29,62],p:[44,88],k:[67,82],f:[66,106],e:[30,77],w:[43,69],eq:INC,wt:dmb(43,68),hl:['arm','fore']}],
  preacher:[
    {h:[46,48],s:[40,58],p:[34,88],k:[56,86],f:[58,106],e:[52,68],w:[60,82],eq:PRE,wt:dmb(61,84),hl:['arm','fore']},
    {h:[46,48],s:[40,58],p:[34,88],k:[56,86],f:[58,106],e:[52,68],w:[56,54],eq:PRE,wt:dmb(56,52),hl:['arm','fore']}],
  overheadtri:[
    mk(STAND,{e:[51,17],w:[51,4],wt:dmb(51,3),hl:['arm','fore']}),
    mk(STAND,{h:[56,20],e:[50,16],w:[42,26],wt:dmb(42,28),hl:['arm','fore']})],
  skullcrusher:[
    {h:[16,72],s:[26,76],p:[56,76],k:[78,78],f:[78,106],e:[27,60],w:[27,46],eq:BNb,wt:plt(27,45,7),hl:['arm','fore']},
    {h:[16,72],s:[26,76],p:[56,76],k:[78,78],f:[78,106],e:[28,60],w:[18,54],eq:BNb,wt:plt(18,54,7),hl:['arm','fore']}],
  tricepskick:[
    {h:[76,48],s:[68,54],p:[42,66],k:[54,86],f:[46,107],e:[55,60],w:[56,75],eq:BNK,wt:dmb(56,77),hl:['arm','fore']},
    {h:[76,48],s:[68,54],p:[42,66],k:[54,86],f:[46,107],e:[55,60],w:[41,66],eq:BNK,wt:dmb(41,67),hl:['arm','fore']}],
  benchdip:[
    {h:[34,28],s:[30,39],p:[40,70],k:[58,84],f:[76,102],ft:[6,0],e:[30,54],w:[30,69],eq:BDB,hl:['arm','chest']},
    {h:[33,41],s:[30,52],p:[38,82],k:[58,92],f:[76,104],ft:[6,0],e:[22,60],w:[30,69],eq:BDB,hl:['arm','chest']}],
  frontsquat:[
    {h:[50,17],s:[50,30],p:[50,60],k:[53,83],f:[50,106],e:[58,38],w:[54,30],eq:RACK,wt:plt(52,28,7),hl:['quad','glute']},
    {h:[32,45],s:[34,56],p:[41,86],k:[64,86],f:[58,107],e:[48,54],w:[38,48],eq:RACK,wt:plt(37,46,7),hl:['quad','glute']}],
  goblet:[
    mk(STAND,{e:[53,44],w:[57,36],wt:dmb(58,36),hl:['quad','glute']}),
    {h:[38,45],s:[38,56],p:[40,86],k:[64,86],f:[58,107],e:[44,66],w:[48,56],wt:dmb(49,56),hl:['quad','glute']}],
  smith:[
    mk(STAND,{e:[44,42],w:[47,30],eq:SMITH,wt:plt(43,30,7),hl:['quad','glute']}),
    {h:[32,45],s:[34,56],p:[41,86],k:[64,86],f:[58,107],e:[40,62],w:[35,54],eq:SMITH,wt:plt(29,55,7),hl:['quad','glute']}],
  stepup:[
    {h:[41,26],s:[40,38],p:[40,68],k:[62,77],f:[70,97],k2:[42,88],f2:[42,106],e:[40,53],w:[41,67],eq:BOX,wt:dmb(41,69),hl:['quad','glute']},
    {h:[68,10],s:[68,22],p:[68,52],k:[69,75],f:[70,97],k2:[84,60],f2:[78,78],e:[68,37],w:[68,51],eq:BOX,wt:dmb(68,53),hl:['quad','glute']}],
  bulgarian:[
    {h:[56,18],s:[56,30],p:[56,60],k:[60,83],f:[62,106],k2:[40,76],f2:[18,84],ft:[6,0],e:[56,45],w:[56,59],eq:BULG,wt:dmb(56,61),hl:['quad','glute']},
    {h:[50,36],s:[50,48],p:[50,76],k:[72,86],f:[72,107],k2:[32,94],f2:[14,84],ft:[6,0],e:[50,62],w:[50,76],eq:BULG,wt:dmb(50,78),hl:['quad','glute']}],
  glutebridge:[
    {h:[12,98],s:[22,100],p:[50,100],k:[68,82],f:[70,106],ft:[6,0],e:[36,102],w:[50,103],eq:MAT,hl:['glute','ham']},
    {h:[12,98],s:[22,100],p:[48,84],k:[68,80],f:[70,106],ft:[6,0],e:[36,102],w:[50,103],eq:MAT,hl:['glute','ham']}],
  goodmorning:[
    mk(STAND,{e:[44,42],w:[47,30],wt:plt(43,30,7),hl:['ham','glute','back']}),
    {h:[70,52],s:[62,56],p:[34,70],k:[54,85],f:[50,107],e:[56,60],w:[58,53],wt:plt(58,52,7),hl:['ham','glute','back']}],
  seatedcalf:[
    {h:[36,46],s:[34,58],p:[34,88],k:[58,84],f:[60,102],ft:[8,0],e:[42,70],w:[52,76],eq:SCALF,wt:pad(53,74,12,8),hl:['calf']},
    {h:[36,46],s:[34,58],p:[34,88],k:[58,80],f:[60,98],ft:[8,5],e:[42,70],w:[52,74],eq:SCALF,wt:pad(53,70,12,8),hl:['calf']}],
  seatedlegcurl:[
    {h:[32,42],s:[34,54],p:[40,84],k:[62,82],f:[84,80],ft:[3,-1],e:[40,66],w:[46,77],eq:SLC,wt:pad(80,74,9,8)+pad(44,72,22,6),hl:['ham']},
    {h:[32,42],s:[34,54],p:[40,84],k:[62,82],f:[62,104],ft:[3,2],e:[40,66],w:[46,77],eq:SLC,wt:pad(57,98,11,7)+pad(44,72,22,6),hl:['ham']}],
  kbswing:[
    {h:[70,52],s:[62,56],p:[34,70],k:[54,85],f:[50,107],e:[58,70],w:[52,84],wt:kb(51,92),hl:['glute','ham']},
    mk(STAND,{e:[65,31],w:[80,32],wt:kb(86,40),hl:['glute','ham','delts']})],
  plank:[
    {h:[94,83],s:[84,88],p:[55,95],k:[31,100],f:[10,106],ft:[-2,1],e:[84,103],w:[98,104],eq:MAT,hl:['abs']},
    {h:[94,83],s:[84,88],p:[55,95],k:[31,100],f:[10,106],ft:[-2,1],e:[84,103],w:[98,104],eq:MAT,hl:['abs']}],
  lyingraise:[
    {h:[7,94],s:[16,98],p:[46,98],k:[68,98],f:[90,98],ft:[5,0],e:[28,102],w:[38,102],eq:MAT,hl:['abs']},
    {h:[7,94],s:[16,98],p:[46,98],k:[46,74],f:[46,52],ft:[5,0],e:[28,102],w:[38,102],eq:MAT,hl:['abs']}],
  diamondpush:[
    {h:[90,70],s:[80,76],p:[52,88],k:[30,97],f:[10,106],ft:[-2,2],e:[80,91],w:[80,106],hl:['arm','chest']},
    {h:[92,92],s:[80,96],p:[51,100],k:[28,103],f:[8,106],ft:[-2,1],e:[72,101],w:[80,106],hl:['arm','chest']}],
  widepush:[
    {h:[90,70],s:[80,76],p:[52,88],k:[30,97],f:[10,106],ft:[-2,2],e:[80,91],w:[80,106],hl:['chest','delts']},
    {h:[92,92],s:[80,96],p:[51,100],k:[28,103],f:[8,106],ft:[-2,1],e:[66,98],w:[80,106],hl:['chest','delts']}],
  declinepush:[
    {h:[90,72],s:[80,78],p:[52,84],k:[30,87],f:[10,90],ft:[-2,2],e:[80,92],w:[80,106],eq:BOXL,hl:['chest','delts']},
    {h:[92,92],s:[80,96],p:[52,95],k:[30,92],f:[10,90],ft:[-2,1],e:[67,98],w:[80,106],eq:BOXL,hl:['chest','delts']}],
  pikepush:[
    {h:[70,88],s:[62,80],p:[44,56],k:[36,78],f:[26,104],ft:[3,2],e:[65,93],w:[68,106],hl:['delts','arm']},
    {h:[70,100],s:[60,92],p:[44,58],k:[36,80],f:[26,104],ft:[3,2],e:[54,96],w:[68,106],hl:['delts','arm']}],
  kneepush:[
    {h:[86,72],s:[76,78],p:[50,90],k:[36,104],f:[16,94],ft:[-2,0],e:[78,92],w:[78,106],eq:MAT,hl:['chest','arm']},
    {h:[88,92],s:[78,96],p:[50,100],k:[36,104],f:[16,98],ft:[-2,0],e:[64,99],w:[78,106],eq:MAT,hl:['chest','arm']}],
  inclinepush:[
    {h:[84,52],s:[74,58],p:[50,78],k:[30,92],f:[12,106],ft:[-2,2],e:[79,72],w:[84,85],eq:INCB,hl:['chest','arm']},
    {h:[86,70],s:[76,76],p:[52,90],k:[32,99],f:[13,107],ft:[-2,1],e:[64,80],w:[84,85],eq:INCB,hl:['chest','arm']}],
  scapular:[
    {h:[56,30],s:[50,40],p:[50,70],k:[56,92],f:[48,104],ft:[5,3],e:[50,25],w:[50,10],eq:PUFW,hl:['back','trap']},
    {h:[54,24],s:[50,34],p:[50,64],k:[56,86],f:[48,98],ft:[5,3],e:[50,22],w:[50,10],eq:PUFW,hl:['back','trap']}],
  widepullup:[
    {h:[56,30],s:[50,40],p:[50,70],k:[56,92],f:[48,104],ft:[5,3],e:[43,25],w:[36,10],e2:[57,25],w2:[64,10],eq:PUFW,hl:['back','arm']},
    {h:[54,17],s:[50,26],p:[50,56],k:[54,78],f:[46,92],ft:[5,3],e:[40,22],w:[36,10],e2:[60,22],w2:[64,10],eq:PUFW,hl:['back','arm']}],
  hangknee:[
    {h:[54,26],s:[50,36],p:[50,66],k:[51,86],f:[50,106],ft:[5,2],e:[50,21],w:[50,6],eq:PUF2,hl:['abs']},
    {h:[54,26],s:[50,36],p:[50,66],k:[70,60],f:[62,80],ft:[3,2],e:[50,21],w:[50,6],eq:PUF2,hl:['abs']}],
  hang:[
    {h:[56,30],s:[50,40],p:[50,70],k:[56,92],f:[48,104],ft:[5,3],e:[50,25],w:[50,10],eq:PUFW,hl:['fore','back']},
    {h:[56,30],s:[50,40],p:[50,70],k:[56,92],f:[48,104],ft:[5,3],e:[50,25],w:[50,10],eq:PUFW,hl:['fore','back']}],
  mountain:[
    {h:[90,70],s:[80,76],p:[52,88],k:[30,97],f:[10,106],ft:[-2,2],k2:[64,98],f2:[52,106],e:[80,91],w:[80,106],hl:['abs','quad']},
    {h:[90,70],s:[80,76],p:[52,88],k:[64,98],f:[52,106],ft:[-2,2],k2:[30,97],f2:[10,106],e:[80,91],w:[80,106],hl:['abs','quad']}],
  hollow:[
    {h:[12,98],s:[22,100],p:[52,100],k:[72,100],f:[90,100],ft:[5,0],e:[10,101],w:[2,101],eq:MAT,hl:['abs']},
    {h:[14,88],s:[24,92],p:[52,100],k:[72,92],f:[89,84],ft:[5,0],e:[16,86],w:[6,82],eq:MAT,hl:['abs']}],
  bicycle:[
    {h:[18,84],s:[26,92],p:[52,100],k:[70,82],f:[86,100],k2:[72,96],f2:[89,92],ft:[5,0],e:[24,80],w:[18,86],eq:MAT,hl:['abs']},
    {h:[18,84],s:[26,92],p:[52,100],k:[72,96],f:[89,92],k2:[70,82],f2:[86,100],ft:[5,0],e:[24,80],w:[18,86],eq:MAT,hl:['abs']}],
  vup:[
    {h:[12,98],s:[22,100],p:[52,100],k:[72,100],f:[90,100],ft:[5,0],e:[10,101],w:[2,101],eq:MAT,hl:['abs']},
    {h:[34,64],s:[38,74],p:[52,100],k:[66,78],f:[80,58],ft:[3,0],e:[53,70],w:[66,66],eq:MAT,hl:['abs']}],
  deadbug:[
    {h:[12,98],s:[22,100],p:[52,100],k:[52,76],f:[70,76],ft:[2,3],k2:[52,76],f2:[70,76],e:[22,86],w:[22,72],eq:MAT,hl:['abs']},
    {h:[12,98],s:[22,100],p:[52,100],k:[72,100],f:[90,100],ft:[5,0],k2:[52,76],f2:[70,76],e:[22,86],w:[22,72],e2:[10,100],w2:[0,100],eq:MAT,hl:['abs']}],
  plankup:[
    {h:[94,83],s:[84,88],p:[55,95],k:[31,100],f:[10,106],ft:[-2,1],e:[84,103],w:[98,104],eq:MAT,hl:['abs','delts']},
    {h:[90,70],s:[80,76],p:[52,88],k:[30,97],f:[10,106],ft:[-2,2],e:[80,91],w:[80,106],eq:MAT,hl:['abs','delts']}],
  flutter:[
    {h:[12,98],s:[22,100],p:[52,100],k:[72,88],f:[89,76],k2:[72,99],f2:[90,98],ft:[5,0],e:[36,102],w:[50,103],eq:MAT,hl:['abs']},
    {h:[12,98],s:[22,100],p:[52,100],k:[72,99],f:[90,98],k2:[72,88],f2:[89,76],ft:[5,0],e:[36,102],w:[50,103],eq:MAT,hl:['abs']}],
  situp:[
    {h:[12,98],s:[22,100],p:[52,100],k:[68,82],f:[82,100],ft:[6,0],e:[28,90],w:[22,84],eq:MAT,hl:['abs']},
    {h:[38,64],s:[40,72],p:[52,100],k:[68,82],f:[82,100],ft:[6,0],e:[54,76],w:[64,70],eq:MAT,hl:['abs']}],
  bwsquat:[
    mk(STAND,{e:[64,33],w:[78,34],hl:['quad','glute']}),
    {h:[32,45],s:[34,56],p:[41,86],k:[64,86],f:[58,107],e:[49,55],w:[64,54],hl:['quad','glute']}],
  jumpsquat:[
    {h:[32,45],s:[34,56],p:[41,86],k:[64,86],f:[58,107],e:[49,55],w:[64,54],hl:['quad','glute']},
    {h:[50,12],s:[50,25],p:[50,54],k:[51,76],f:[50,100],ft:[4,6],e:[44,38],w:[38,50],hl:['quad','calf']}],
  pistol:[
    mk(STAND,{e:[64,33],w:[78,34],hl:['quad','glute']}),
    {h:[30,46],s:[34,58],p:[40,86],k:[62,86],f:[56,107],k2:[64,84],f2:[86,82],e:[49,56],w:[63,52],hl:['quad','glute']}],
  bwlunge:[
    mk(STAND,{e:[50,45],w:[51,60],hl:['quad','glute']}),
    {h:[50,34],s:[48,46],p:[48,76],k:[70,86],f:[70,107],k2:[34,98],f2:[14,104],e:[48,60],w:[48,74],hl:['quad','glute']}],
  wallsit:[
    {h:[16,40],s:[14,50],p:[15,78],k:[38,84],f:[38,106],ft:[6,0],e:[22,64],w:[34,76],eq:WALLB,hl:['quad']},
    {h:[16,46],s:[14,56],p:[15,84],k:[39,84],f:[39,106],ft:[6,0],e:[22,70],w:[34,80],eq:WALLB,hl:['quad']}],
  bwcalf:[
    mk(STAND,{e:[50,45],w:[51,60],hl:['calf']}),
    {h:[50,11],s:[50,24],p:[50,53],k:[51,76],f:[50,100],ft:[8,5],e:[50,38],w:[51,53],hl:['calf']}],
  singlebridge:[
    {h:[12,98],s:[22,100],p:[50,100],k:[68,82],f:[70,106],ft:[6,0],k2:[70,82],f2:[90,68],e:[36,102],w:[50,103],eq:MAT,hl:['glute','ham']},
    {h:[12,98],s:[22,100],p:[48,84],k:[68,80],f:[70,106],ft:[6,0],k2:[70,74],f2:[90,60],e:[36,102],w:[50,103],eq:MAT,hl:['glute','ham']}],
  nordic:[
    {h:[50,38],s:[50,50],p:[50,80],k:[50,104],f:[26,104],ft:[-3,0],e:[56,64],w:[50,58],eq:NORS+MAT,hl:['ham','glute']},
    {h:[84,86],s:[72,88],p:[44,96],k:[20,104],f:[0,104],ft:[-3,0],e:[78,98],w:[90,106],eq:NORS+MAT,hl:['ham','glute']}],
  burpee:[
    mk(STAND,{e:[50,45],w:[51,60],hl:['quad','chest','abs']}),
    {h:[90,70],s:[80,76],p:[52,88],k:[30,97],f:[10,106],ft:[-2,2],e:[80,91],w:[80,106],hl:['quad','chest','abs']}],
  superman:[
    {fd:-1,h:[12,98],s:[22,100],p:[52,100],k:[72,100],f:[90,100],ft:[5,0],e:[10,101],w:[3,101],eq:MAT,hl:['back','glute']},
    {fd:-1,h:[12,90],s:[22,94],p:[52,100],k:[72,92],f:[90,84],ft:[5,0],e:[12,90],w:[5,86],eq:MAT,hl:['back','glute']}],
  birddog:[
    {h:[82,74],s:[72,78],p:[42,80],k:[42,104],f:[20,104],ft:[-3,0],e:[72,92],w:[72,106],eq:MAT,hl:['back','glute']},
    {h:[82,74],s:[72,78],p:[42,80],k:[42,104],f:[20,104],ft:[-3,0],k2:[22,82],f2:[2,82],e:[86,74],w:[98,70],e2:[72,92],w2:[72,106],eq:MAT,hl:['back','glute']}],
  lsit:[
    {h:[40,50],s:[40,62],p:[42,92],k:[62,80],f:[50,94],ft:[3,0],e:[41,77],w:[44,92],eq:PARAL,hl:['abs','arm']},
    {h:[40,50],s:[40,62],p:[42,92],k:[66,92],f:[88,92],ft:[3,0],e:[41,77],w:[44,92],eq:PARAL,hl:['abs','arm']}]
};

/* ---------- figura anatómica ---------- */
POSES.chinup=POSES.pullup;
POSES.closegrip=POSES.pulldown;
POSES.frontraise=POSES.lateral;
function ali(id,a,b){var P=POSES[id];return [mk(P[0],a||{}),mk(P[1],b||a||{})]}
function cabEq(y){var t=Math.min(18,y-8);return TB(98,108,98,t,3.4,1)+pul(97,y)}
function wl(x,y){return '<circle class="wt" cx="'+x+'" cy="'+y+'" r="6"/><circle class="wti" cx="'+x+'" cy="'+y+'" r="1.8"/>'}
var WCB=pad(24,92,30,6)+TB(30,98,30,108,3)+TB(48,98,48,108,3);
POSES.dbfly=ali('dbbench',{hl:['chest','delts']},{e:[38,80],w:[30,72],wt:dmb(30,71),hl:['chest','delts']});
POSES.closebench=ali('bench',{hl:['arm','chest']});
POSES.machfly=ali('chestpress',{e:[44,62],w:[40,52],eq:CP+TB(40,52,29,56,2.6,0),wt:hnd(40,52),hl:['chest','delts']},{hl:['chest','delts']});
POSES.cablefly=[mk(STAND,{e:[44,42],w:[38,34],eq:cabEq(34)+cab(38,34,97,34),wt:hnd(38,34),hl:['chest','delts']}),mk(STAND,{e:[56,42],w:[68,48],eq:cabEq(34)+cab(68,48,97,34),wt:hnd(68,48),hl:['chest','delts']})];
POSES.tbar=ali('row',{wt:plt(68,86,7)+plt(74,92,6),hl:['back','arm']},{wt:plt(62,74,7)+plt(68,80,6),hl:['back','arm']});
POSES.pendlay=ali('row',{h:[78,64],s:[68,68],p:[40,74],k:[56,88],f:[50,107],e:[68,83],w:[68,96],wt:plt(68,98,10),hl:['back','arm']},{h:[78,64],s:[68,68],p:[40,74],k:[56,88],f:[50,107],e:[62,78],w:[64,86],wt:plt(64,88,10),hl:['back','arm']});
POSES.straightarm=[mk(STAND,{e:[56,36],w:[62,22],eq:cabEq(8)+cab(62,22,97,8),wt:hnd(62,22),hl:['back']}),mk(STAND,{e:[52,48],w:[52,62],eq:cabEq(8)+cab(52,62,97,8),wt:hnd(52,62),hl:['back']})];
POSES.sumodl=ali('deadlift',{hl:['glute','ham','back']});
POSES.reversefly=ali('row',{wt:dmb(68,86),hl:['delts','back']},{e:[66,64],w:[62,70],wt:dmb(62,70),hl:['delts','back']});
POSES.hacksquat=ali('smith',{hl:['quad','glute']});
POSES.revlunge=ali('lunge',{hl:['quad','glute']});
POSES.sumosquat=ali('goblet',{hl:['quad','glute']});
POSES.stiffdl=ali('rdl',{hl:['ham','glute','back']},{k:[54,80],hl:['ham','glute','back']});
POSES.pullthrough=ali('kbswing',{eq:KB,wt:hnd(52,84),hl:['glute','ham']},{e:[52,46],w:[54,60],eq:KB,wt:hnd(54,60),hl:['glute','ham']});
POSES.singlerdl=ali('rdl',{hl:['ham','glute']},{k2:[16,70],f2:[2,70],hl:['ham','glute']});
POSES.arnold=ali('dbohp',{hl:['delts','arm']});
POSES.cablelateral=ali('lateral',{eq:cabEq(100)+cab(51,62,97,100),wt:hnd(51,62),hl:['delts']},{eq:cabEq(100)+cab(79,35,97,100),wt:hnd(79,35),hl:['delts']});
POSES.frontplate=[mk(STAND,{e:[50,46],w:[51,60],wt:plt(51,62,8),hl:['delts']}),mk(STAND,{e:[60,36],w:[70,32],wt:plt(70,34,8),hl:['delts']})];
POSES.barbellshrug=[mk(STAND,{e:[50,46],w:[51,60],wt:plt(52,62,9),hl:['trap']}),mk(POSES.shrug[1],{wt:plt(51,58,9),hl:['trap']})];
POSES.hammer=ali('curl',{hl:['arm','fore']},{w:[60,36],wt:dmb(60,35),hl:['arm','fore']});
POSES.concentration=ali('preacher',{hl:['arm']});
POSES.cablecurl=[mk(STAND,{e:[50,46],w:[51,60],eq:cabEq(100)+cab(51,60,97,100),wt:hnd(51,60),hl:['arm','fore']}),mk(STAND,{e:[50,46],w:[62,37],eq:cabEq(100)+cab(62,37,97,100),wt:hnd(62,37),hl:['arm','fore']})];
POSES.ropepush=ali('pushdown',{hl:['arm']});
POSES.reversecurl=ali('barbellcurl',{hl:['fore','arm']});
POSES.wristcurl=[{h:[36,46],s:[34,58],p:[34,88],k:[58,84],f:[60,106],ft:[8,0],e:[46,72],w:[58,80],eq:WCB,wt:hnd(58,81),hl:['fore']},{h:[36,46],s:[34,58],p:[34,88],k:[58,84],f:[60,106],ft:[8,0],e:[46,72],w:[58,74],eq:WCB,wt:hnd(58,75),hl:['fore']}];
POSES.cablecrunch=[{h:[50,38],s:[50,50],p:[50,80],k:[50,104],f:[26,104],ft:[-3,0],e:[54,44],w:[52,36],eq:MAT+PUSHF+cab(52,36,66,4),hl:['abs']},{h:[68,66],s:[60,56],p:[50,80],k:[50,104],f:[26,104],ft:[-3,0],e:[64,64],w:[60,70],eq:MAT+PUSHF+cab(60,70,66,4),hl:['abs']}];
POSES.abwheel=[{h:[66,62],s:[56,68],p:[34,84],k:[30,104],f:[10,104],ft:[-3,0],e:[60,84],w:[62,100],eq:MAT+wl(62,102),hl:['abs']},{h:[82,88],s:[70,92],p:[36,92],k:[30,104],f:[10,104],ft:[-3,0],e:[80,98],w:[86,102],eq:MAT+wl(86,102),hl:['abs']}];
POSES.reversecrunch=[{h:[12,98],s:[22,100],p:[52,100],k:[56,76],f:[74,76],ft:[2,3],e:[36,102],w:[48,103],eq:MAT,hl:['abs']},{h:[12,98],s:[22,100],p:[52,92],k:[56,66],f:[74,68],ft:[2,3],e:[36,102],w:[48,103],eq:MAT,hl:['abs']}];
POSES.woodchop=[mk(STAND,{e:[56,26],w:[62,14],eq:PUSHF+cab(62,14,66,4),wt:hnd(62,14),hl:['abs','delts']}),mk(STAND,{e:[50,52],w:[52,66],eq:PUSHF+cab(52,66,66,4),wt:hnd(52,66),hl:['abs','delts']})];
POSES.dipsmach=ali('chestpress',{e:[46,70],w:[52,76],eq:CP+TB(52,76,29,56,2.6,0),wt:hnd(52,76),hl:['arm','chest']},{e:[48,64],w:[56,86],eq:CP+TB(56,86,29,56,2.6,0),wt:hnd(56,86),hl:['arm','chest']});

var TORSO=[[-.12,5,5.6],[0,8.4,7.4],[.14,10.8,9],[.34,9,8],[.6,6.4,6],[.85,6.6,7.6],[1,6.4,8.2],[1.1,4.2,5.5]];
var THIGH=[[-.08,6.8,8.2],[.2,8,8.4],[.5,7.8,6.8],[.8,6,5.2],[1,4.8,4.8],[1.06,3.7,3.7]];
var SHIN=[[-.06,4.3,4.3],[.15,4.3,6],[.38,4,6.6],[.68,3.5,4.1],[1,3,3],[1.06,2.4,2.4]];
var UARM=[[-.08,4.7,4.9],[.25,5.5,5.5],[.55,4.9,5.1],[1,3.5,3.6],[1.07,3.2,3.2]];
var FARM=[[-.07,3.6,3.6],[.2,4.3,4.1],[.6,3.2,3],[1,2.4,2.4],[1.07,2.2,2.2]];

function n1(v){return Math.round(v*10)/10}
function pt(a){return n1(a[0])+','+n1(a[1])}
function prof(pts,t){
  var i,u;
  if(t<=pts[0][0]) return [pts[0][1],pts[0][2]];
  for(i=0;i<pts.length-1;i++){
    if(t<=pts[i+1][0]){
      u=(t-pts[i][0])/(pts[i+1][0]-pts[i][0]);
      return [pts[i][1]+(pts[i+1][1]-pts[i][1])*u, pts[i][2]+(pts[i+1][2]-pts[i][2])*u];
    }
  }
  var l=pts[pts.length-1]; return [l[1],l[2]];
}
function cr(P){
  var n=P.length, i, d='M'+pt(P[0]), p0,p1,p2,p3,c1,c2;
  for(i=0;i<n;i++){
    p0=P[(i-1+n)%n]; p1=P[i]; p2=P[(i+1)%n]; p3=P[(i+2)%n];
    c1=[p1[0]+(p2[0]-p0[0])/6, p1[1]+(p2[1]-p0[1])/6];
    c2=[p2[0]-(p3[0]-p1[0])/6, p2[1]-(p3[1]-p1[1])/6];
    d+=' C'+pt(c1)+' '+pt(c2)+' '+pt(p2);
  }
  return d+'Z';
}
function SEG(a,b,fd){
  var dx=b[0]-a[0], dy=b[1]-a[1], len=Math.sqrt(dx*dx+dy*dy)||1, ux=dx/len, uy=dy/len;
  return {a:a,b:b,len:len,ux:ux,uy:uy,nx:uy*fd,ny:-ux*fd,
    P:function(t,o){return [a[0]+ux*len*t+this.nx*o, a[1]+uy*len*t+this.ny*o]}};
}
function shp(sg,pts,o){
  o=o||{};
  var t0=o.t0!=null?o.t0:pts[0][0], t1=o.t1!=null?o.t1:pts[pts.length-1][0];
  var fs=o.fs!=null?o.fs:1, bs=o.bs!=null?o.bs:1, i, ts=[], F=[], B=[];
  if(o.round){for(i=0;i<9;i++) ts.push(t0+(t1-t0)*i/8)}
  else ts=pts.map(function(q){return q[0]});
  ts.forEach(function(t){
    var w=prof(pts,t), k=1, q;
    if(o.round){q=2*(t-t0)/(t1-t0)-1; k=Math.max(.12,Math.sqrt(Math.max(0,1-Math.pow(q,4))))}
    F.push(sg.P(t,w[0]*fs*k)); B.push(sg.P(t,-w[1]*bs*k));
  });
  return cr(F.concat(B.reverse()));
}
function PH(sg,pts,cls,o){return '<path class="'+cls+'" d="'+shp(sg,pts,o)+'"/>'}
function LNp(a,b,c){return '<path class="dl" d="M'+pt(a)+' '+(c?'Q'+pt(c)+' ':'L')+pt(b)+'"/>'}
function L(a,b,w,c){return '<line class="'+c+'" x1="'+n1(a[0])+'" y1="'+n1(a[1])+'" x2="'+n1(b[0])+'" y2="'+n1(b[1])+'" style="stroke-width:'+w+'"/>'}
function shf(a,d){return [a[0]+d[0],a[1]+d[1]]}
function shoe(f,ft){var t=[f[0]+ft[0],f[1]+ft[1]];return L(f,t,8.4,'o')+L(f,t,6,'shoe')}

function limbPass(list,cls){
  return list.map(function(q){return PH(q[0],q[1],'bo')}).join('')+list.map(function(q){return PH(q[0],q[1],cls)}).join('');
}
function shade(list){return list.map(function(q){return PH(q[0],q[1],'bsd',{fs:0})}).join('')}

function pose(p){
  var fd=p.fd||1, s=p.s,pp=p.p,k=p.k,f=p.f,h=p.h,e=p.e,w=p.w, ft=p.ft||[8,0], d=p.far||[-3,0], hl=p.hl||[];
  var has=function(n){return hl.indexOf(n)>=0};
  var T=SEG(s,pp,fd), TH=SEG(pp,k,fd), SH=SEG(k,f,fd);
  var fk=p.k2||shf(k,d), ff=p.f2||shf(f,d);
  var o='<rect class="floor" x="0" y="108" width="100" height="12"/><ellipse class="shd" cx="'+n1((pp[0]+f[0])/2+2)+'" cy="108.5" rx="'+n1(Math.max(26,Math.abs(pp[0]-f[0])+22))+'" ry="4.6"/>'+(p.eq||'');
  /* extremidades lejanas */
  var far=[[SEG(pp,fk,fd),THIGH],[SEG(fk,ff,fd),SHIN]];
  if(e){
    var s2=shf(s,d), e2=p.e2||shf(e,d), w2=p.w2||shf(w,d);
    far.push([SEG(s2,e2,fd),UARM],[SEG(e2,w2,fd),FARM]);
  }
  o+=limbPass(far,'bf2')+shade(far)+shoe(ff,ft);
  /* cuello y cuerpo */
  var fsh=[s[0]-T.nx*3.2+d[0]*.4,s[1]-T.ny*3.2];
  o+='<circle class="bo" cx="'+n1(fsh[0])+'" cy="'+n1(fsh[1])+'" r="6.2"/><circle class="bf2" cx="'+n1(fsh[0])+'" cy="'+n1(fsh[1])+'" r="6.2"/>';
  o+=L(s,h,7,'o')+L(s,h,4.4,'sk');
  var body=[[T,TORSO],[TH,THIGH],[SH,SHIN]];
  o+=limbPass(body,'bf')+shade(body)+shoe(f,ft);
  /* pantalón corto */
  o+=PH(TH,THIGH,'shs',{t0:-.1,t1:.54,fs:1.06,bs:1.06,round:1})+PH(T,TORSO,'shs',{t0:.84,t1:1.14,fs:1.08,bs:1.08,round:1});
  /* definición del cuerpo */
  o+=LNp(T.P(.42,6.2),T.P(.2,1.2),T.P(.3,3.6));                 /* borde inferior del pectoral */
  [.54,.68,.82].forEach(function(t){var w0=prof(TORSO,t)[0];o+=LNp(T.P(t,w0-.5),T.P(t,w0-3.8))});  /* abdominales */
  o+=LNp(T.P(.22,-5.6),T.P(.78,-6.4),T.P(.5,-4.6));              /* dorsal */
  o+='<path class="spn" d="M'+pt(T.P(.02,-4.5))+' L'+pt(T.P(.9,-5))+'"/>';
  o+=LNp(T.P(.9,-7.2),T.P(1.13,-2.4),T.P(1.12,-6.6));            /* glúteo */
  o+=LNp(TH.P(.26,3.4),TH.P(.86,2.4),TH.P(.55,4.2));             /* cuádriceps */
  o+=LNp(TH.P(.24,-3.2),TH.P(.86,-2.4),TH.P(.55,-4.2));          /* isquios */
  o+='<circle class="dlf" cx="'+n1(TH.P(1.0,3.4)[0])+'" cy="'+n1(TH.P(1.0,3.4)[1])+'" r="2.5"/>';  /* rótula */
  o+=LNp(SH.P(.14,-4.6),SH.P(.6,-2.4),SH.P(.34,-6.2));           /* gemelo */
  o+=LNp(SH.P(.2,2.2),SH.P(.85,1.4));                            /* tibia */
  /* músculos resaltados del cuerpo */
  if(has('chest')) o+=PH(T,TORSO,'mh',{t0:.06,t1:.46,fs:.92,bs:.28,round:1});
  if(has('back')) o+=PH(T,TORSO,'mh',{t0:.1,t1:.9,fs:.15,bs:.92,round:1});
  if(has('abs')) o+=PH(T,TORSO,'mh',{t0:.46,t1:.96,fs:.85,bs:.18,round:1});
  if(has('trap')) o+=PH(T,TORSO,'mh',{t0:-.1,t1:.26,fs:.7,bs:.95,round:1});
  if(has('glute')) o+=PH(T,TORSO,'mh',{t0:.84,t1:1.14,fs:.2,bs:.95,round:1});
  if(has('quad')) o+=PH(TH,THIGH,'mh',{t0:.1,t1:.96,fs:.95,bs:.22,round:1});
  if(has('ham')) o+=PH(TH,THIGH,'mh',{t0:.1,t1:.96,fs:.22,bs:.95,round:1});
  if(has('calf')) o+=PH(SH,SHIN,'mh',{t0:.08,t1:.72,fs:.2,bs:.95,round:1});
  /* brazo cercano */
  if(e){
    var UA=SEG(s,e,fd), FA=SEG(e,w,fd), arm=[[UA,UARM],[FA,FARM]];
    o+=limbPass(arm,'bf')+shade(arm);
    o+=PH(UA,UARM,'dlf',{t0:-.16,t1:.44,fs:1.15,bs:1.15,round:1});
    o+=LNp(UA.P(.14,3),UA.P(.5,1.2),UA.P(.3,2.6))+LNp(UA.P(.2,-1.2),UA.P(.8,-1.2));
    o+=LNp(UA.P(.18,.4),UA.P(.88,.3),UA.P(.5,1.4));
    o+=LNp(FA.P(.15,1.6),FA.P(.72,.6));
    if(has('delts')) o+=PH(UA,UARM,'mh',{t0:-.16,t1:.44,fs:1.15,bs:1.15,round:1});
    if(has('arm')) o+=PH(UA,UARM,'mh',{t0:.1,t1:.96,fs:.9,bs:.9,round:1});
    if(has('fore')) o+=PH(FA,FARM,'mh',{t0:.08,t1:.92,fs:.9,bs:.9,round:1});
    o+='<circle class="skf" cx="'+n1(w[0])+'" cy="'+n1(w[1])+'" r="3.4"/>';
  }
  /* cabeza */
  var vx=h[0]-s[0], vy=h[1]-s[1], ang=Math.round(Math.atan2(vx,-vy)*180/Math.PI);
  var nose=[h[0]+T.nx*7.2,h[1]+T.ny*7.2], ear=[h[0]-T.nx*1.6,h[1]-T.ny*1.6], eye=[h[0]+T.nx*3.4,h[1]+T.ny*3.4];
  o+='<circle class="skf" cx="'+n1(h[0])+'" cy="'+n1(h[1])+'" r="7"/>'+
     '<circle class="skf" cx="'+n1(nose[0])+'" cy="'+n1(nose[1])+'" r="1.5"/>'+
     '<path class="hair" d="M-7.3,1.2 A7.3,7.3 0 0 1 7.3,1.2 L7.3,2.8 Q3.5,0.2 0,1.4 Q-3.5,0.2 -7.3,2.8 Z" transform="translate('+n1(h[0])+','+n1(h[1])+') rotate('+ang+')"/>'+
     '<circle class="dlf" cx="'+n1(ear[0])+'" cy="'+n1(ear[1])+'" r="1.5"/>'+
     '<circle cx="'+n1(eye[0])+'" cy="'+n1(eye[1])+'" r=".8" fill="var(--ink)"/>';
  return o+(p.wt||'');
}
function fig2(id){
  var ps=POSES[id];
  return '<svg class="fig" viewBox="0 0 200 120" role="img" aria-label="'+esc(EX[id].n)+': posición inicial y posición final">'+
    '<rect class="panel" width="200" height="120"/><g>'+pose(ps[0])+'</g>'+
    '<line x1="100" y1="6" x2="100" y2="114" stroke="var(--ill-text)" stroke-opacity=".35" stroke-width="1.2" stroke-dasharray="3 3"/>'+
    '<g transform="translate(100,0)">'+pose(ps[1])+'</g><text x="6" y="117">INICIO</text><text x="106" y="117">FINAL</text></svg>';
}

/* ---------- figuras 3D (motor propio sobre canvas, sin librerías) ---------- */
var R3={q:[],cache:{},busy:0,col:null,sig:'',PW:360,PH:432,Q:1.6,YAW:.62,PIT:.27,io:null,bad:0,rec:null,fake:null};
var LS=[-.5,-.86];
function r3cols(){
  var cs=getComputedStyle(document.documentElement), cv=document.createElement('canvas'), o={}, sig=[];
  cv.width=cv.height=1;
  var cx=cv.getContext('2d');
  ['ink','skin','skin2','shorts','hair','shoe','hl','hl-line','metal','eqacc','pad','wtc','ill-bg','ill-floor','ill-text','skin-line'].forEach(function(n){
    var v=cs.getPropertyValue('--'+n).trim()||'#888', d;
    cx.clearRect(0,0,1,1); cx.fillStyle='#888'; cx.fillStyle=v; cx.fillRect(0,0,1,1);
    d=cx.getImageData(0,0,1,1).data; o[n]=[d[0],d[1],d[2]]; sig.push(d[0]+'.'+d[1]+'.'+d[2]);
  });
  var FLAT={ink:[27,35,80],skin:[247,249,253],skin2:[222,228,242],shorts:[40,49,112],hair:[27,35,80],shoe:[233,237,247],hl:[45,130,232],'hl-line':[27,35,80],metal:[211,217,230],eqacc:[184,192,211],pad:[160,169,191],wtc:[124,131,152],'ill-bg':[255,255,255],'ill-floor':[230,234,243],'ill-text':[90,98,133],'skin-line':[120,132,176]};
  o=FLAT; R3.col=o; R3.sig='flat1';
}
function rgba(c,a){return 'rgba('+Math.round(c[0])+','+Math.round(c[1])+','+Math.round(c[2])+','+(a==null?1:a)+')'}
function mixc(c,t,k){return [c[0]+(t[0]-c[0])*k,c[1]+(t[1]-c[1])*k,c[2]+(t[2]-c[2])*k]}
function lite(c,k){return mixc(c,[255,255,255],k)}
function dk(c,k){return mixc(c,[14,16,38],k)}
function cpath(g,P){
  var n=P.length,i,p0,p1,p2,p3;
  g.beginPath(); g.moveTo(P[0][0],P[0][1]);
  for(i=0;i<n;i++){
    p0=P[(i-1+n)%n];p1=P[i];p2=P[(i+1)%n];p3=P[(i+2)%n];
    g.bezierCurveTo(p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6,p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6,p2[0],p2[1]);
  }
  g.closePath();
}
function lpts(sg,pts,o,u){
  o=o||{};
  var t0=o.t0!=null?o.t0:pts[0][0], t1=o.t1!=null?o.t1:pts[pts.length-1][0];
  var fs=o.fs!=null?o.fs:1, bs=o.bs!=null?o.bs:1, i, ts=[], F=[], B=[];
  if(o.round){for(i=0;i<9;i++) ts.push(t0+(t1-t0)*i/8)}
  else ts=pts.map(function(q){return q[0]});
  ts.forEach(function(t){
    var w=prof(pts,t), k=1, q;
    if(o.round){q=2*(t-t0)/(t1-t0)-1; k=Math.max(.12,Math.sqrt(Math.max(0,1-Math.pow(q,4))))}
    F.push(sg.P(t,w[0]*fs*k*u)); B.push(sg.P(t,-w[1]*bs*k*u));
  });
  return F.concat(B.reverse());
}
function pmax(pts){var m=0;pts.forEach(function(q){m=Math.max(m,q[1],q[2])});return m}

function panel3(g,p,eqHasArm,fit){
  var C=R3.col, PW=R3.PW, PH=R3.PH, fd=p.fd||1, th=R3.YAW*fd, ct=Math.cos(th), st=Math.sin(th),
      cp=Math.cos(R3.PIT), sp=Math.sin(R3.PIT), sc=PW/108*(fit?fit.k:1), ox=fit?fit.ox:PW/2, oy=fit?fit.oy:PH*.52;
  function P(x,y,z){
    var X=x-50, Y=54-y, Z=z||0, xr=X*ct-Z*st, zr=X*st+Z*ct, o=[ox+xr*sc, oy-(Y*cp-zr*sp)*sc, Y*sp+zr*cp];
    if(R3.rec) R3.rec.push(o);
    return o;
  }
  function V(X,Y,Z){var xr=X*ct-Z*st, zr=X*st+Z*ct;return [xr,Y*cp-zr*sp,Y*sp+zr*cp]}
  var hl=p.hl||[], has=function(n){return hl.indexOf(n)>=0};
  /* ---- primitivas ---- */
  var OL=2.1;
  function ball(s,r,c){
    g.fillStyle=rgba(c);g.beginPath();g.arc(s[0],s[1],r,0,6.2832);g.fill();
    g.strokeStyle=rgba(C.ink);g.lineWidth=OL;g.stroke();
  }
  function tube(a,b,r,c,ol){
    g.lineCap='round';
    if(ol!==0){g.strokeStyle=rgba(C.ink);g.lineWidth=2*r+OL*1.7;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()}
    else if(c===C.skin||c===C.skin2||c.length===3&&r>2){}
    g.strokeStyle=rgba(c);g.lineWidth=2*r;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();
  }
  function poly(pts){g.beginPath();pts.forEach(function(q,i){i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1])});g.closePath()}
  function disc(x,y,r,z0,z1,c,hub){
    var n=4,k,i,a,pts,f=P(x,y,z1);
    function ring(z,rr){var o=[];for(i=0;i<28;i++){a=i/28*6.2832;o.push(P(x+Math.cos(a)*rr,y+Math.sin(a)*rr,z))}return o}
    for(k=0;k<n;k++){poly(ring(z0+(z1-z0)*k/n,r));g.fillStyle=rgba(dk(c,.28));g.fill();g.strokeStyle=rgba(C.ink,.9);g.lineWidth=OL*.8;g.stroke()}
    pts=ring(z1,r);poly(pts);
    g.fillStyle=rgba(c);g.fill();g.strokeStyle=rgba(C.ink);g.lineWidth=OL;g.stroke();
    if(hub){poly(ring(z1+.05,r*.34));g.fillStyle=rgba(lite(C.metal,.25));g.fill();g.strokeStyle=rgba(C.ink);g.lineWidth=OL*.8;g.stroke()}
  }
  function box(cx,cy,w,h,d,rot,c,zc){
    var a=(rot||0)*Math.PI/180, ca=Math.cos(a), sa=Math.sin(a), vs=[], i, sx, sy, sz, F, f, fs=[];
    zc=zc||0;
    for(sz=-1;sz<=1;sz+=2)for(sy=-1;sy<=1;sy+=2)for(sx=-1;sx<=1;sx+=2){
      var lx=sx*w/2, ly=sy*h/2;
      vs.push(P(cx+lx*ca-ly*sa,cy+lx*sa+ly*ca,zc+sz*d/2));
    }
    /* índices: bit0=x, bit1=y(svg), bit2=z */
    F=[[[0,1,3,2],[0,0,-1]],[[4,5,7,6],[0,0,1]],[[0,1,5,4],[0,-1,0]],[[2,3,7,6],[0,1,0]],[[0,2,6,4],[-1,0,0]],[[1,3,7,5],[1,0,0]]];
    F.forEach(function(q){
      var nl=q[1], nx=nl[0]*ca-nl[1]*sa, ny=nl[0]*sa+nl[1]*ca, nz=nl[2], nv=V(nx,-ny,nz);
      if(nv[2]<=0) return;
      var dd=Math.max(0,nv[0]*-.4+nv[1]*.7+nv[2]*.6), sh=.5+.5*dd/1.0, col=sh>=.62?lite(c,(sh-.62)*.9):dk(c,(.62-sh)*.9);
      fs.push([q[0],col,(vs[q[0][0]][2]+vs[q[0][2]][2])/2]);
    });
    fs.sort(function(a,b){return a[2]-b[2]});
    fs.forEach(function(q){
      poly(q[0].map(function(i){return vs[i]}));g.fillStyle=rgba(q[1]);g.fill();
      g.lineJoin='round';g.lineWidth=OL;g.strokeStyle=rgba(C.ink);g.stroke();
    });
    g.lineJoin='miter';
  }
  /* ---- equipo: pasa el SVG del cuadro a primitivas 3D ---- */
  function parse(str,isWt,out){
    var re=/<(line|rect|circle|path)\b([^>]*?)\/?>/g, m, tg=[], i;
    while((m=re.exec(str||''))){var a={t:m[1]};m[2].replace(/([\w-]+)="([^"]*)"/g,function(_,k,v){a[k]=v});tg.push(a)}
    function num(v){return parseFloat(v)}
    function sw(a){var q=/stroke-width:([\d.]+)/.exec(a.style||'');return q?parseFloat(q[1]):3}
    function add(o,dp){o.dp=dp!=null?dp:0;out.push(o)}
    for(i=0;i<tg.length;i++){
      var a=tg[i], c=a['class']||'', x1,y1,x2,y2,w,h,r,nx;
      if(a.t==='line'){
        x1=num(a.x1);y1=num(a.y1);x2=num(a.x2);y2=num(a.y2);w=sw(a);
        if(c==='tbo') continue;
        if(c==='padl'){
          var L=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)), ang=Math.atan2(y2-y1,x2-x1)*180/Math.PI;
          add({k:'box',cx:(x1+x2)/2,cy:(y1+y2)/2,w:L+w*.4,h:w,d:14,rot:ang,c:C.pad,st:2},P((x1+x2)/2,(y1+y2)/2,0)[2]);
        }else if(c==='cab'){
          add({k:'tube',a:[x1,y1,0],b:[x2,y2,0],r:.5,c:dk(C.metal,.5),st:2,ol:0},P((x1+x2)/2,(y1+y2)/2,0)[2]);
        }else{
          var col=c==='tba'?C.eqacc:C.metal, thin=(c==='tb'&&w<=3.2&&Math.abs(x2-x1)<Math.abs(y2-y1)*.3), zs=thin?[-6,6]:[0];
          zs.forEach(function(z){add({k:'tube',a:[x1,y1,z],b:[x2,y2,z],r:w*.5,c:col,st:2},P((x1+x2)/2,(y1+y2)/2,z)[2])});
        }
      }else if(a.t==='rect'){
        x1=num(a.x);y1=num(a.y);w=num(a.width);h=num(a.height);
        var rt=/rotate\(([-\d.]+)/.exec(a.transform||''), rot=rt?parseFloat(rt[1]):0, cx=x1+w/2, cy=y1+h/2;
        if(c==='pad'){
          var dd=14, bs=-100;
          if(h<=5&&w>=60){dd=40;bs=-900}
          else if(w<=8&&h>=60){dd=44;bs=-500}
          else if(h>=10&&w>=24){dd=24}
          else if(w<=12&&h<=12){dd=10}
          add({k:'box',cx:cx,cy:cy,w:w,h:h,d:dd,rot:rot,c:C.pad,st:2},bs+P(cx,cy,0)[2]);
        }else if(c==='stk'){
          add({k:'box',cx:cx,cy:cy,w:w,h:h,d:10,rot:0,c:C.wtc,st:2},P(cx,cy,0)[2]);
        }else if(c==='wt'){
          var big=w>=10, zc=isWt?5:0;
          if(big){ /* mancuerna */
            [[zc,8],[-zc,2]].forEach(function(q){
              if(q[1]===2&&!eqHasArm) return;
              var z=q[0];
              add({k:'tube',a:[cx,cy,z-5],b:[cx,cy,z+5],r:1.3,c:C.metal,st:q[1]},P(cx,cy,z)[2]);
              add({k:'disc',x:cx,y:cy,r:3.9,z0:z+3,z1:z+6.4,c:C.wtc,st:q[1]},P(cx,cy,z+5)[2]);
              add({k:'disc',x:cx,y:cy,r:3.9,z0:z-6.4,z1:z-3,c:C.wtc,st:q[1]},P(cx,cy,z-5)[2]);
            });
          }else{ /* asa de polea */
            add({k:'tube',a:[cx,cy,zc-4.5],b:[cx,cy,zc+4.5],r:1.7,c:dk(C.metal,.25),st:isWt?8:2},P(cx,cy,zc)[2]);
          }
        }
      }else if(a.t==='circle'){
        x1=num(a.cx);y1=num(a.cy);r=num(a.r);
        if(c==='wt'){
          var nxt=tg[i+1]&&tg[i+1].t==='path'&&tg[i+1]['class']==='cab', dep=P(x1,y1,0)[2];
          if(nxt){
            add({k:'ball',x:x1,y:y1,z:0,r:r,c:C.wtc,st:8},dep);
            add({k:'tube',a:[x1-4.2,y1-5,0],b:[x1,y1-10,0],r:1.1,c:dk(C.wtc,.2),st:8},dep);
            add({k:'tube',a:[x1,y1-10,0],b:[x1+4.2,y1-5,0],r:1.1,c:dk(C.wtc,.2),st:8},dep);
          }else if(isWt){ /* barra con discos */
            add({k:'tube',a:[x1,y1,-27],b:[x1,y1,0],r:1.3,c:C.metal,st:2},dep);
            add({k:'tube',a:[x1,y1,0],b:[x1,y1,27],r:1.3,c:C.metal,st:8},dep);
            add({k:'disc',x:x1,y:y1,r:r,z0:-18,z1:-14,c:C.wtc,hub:1,st:2},P(x1,y1,-16)[2]);
            add({k:'disc',x:x1,y:y1,r:r,z0:14,z1:18,c:C.wtc,hub:1,st:8},P(x1,y1,16)[2]);
          }else{ /* rueda */
            add({k:'disc',x:x1,y:y1,r:r,z0:-3,z1:3,c:C.wtc,hub:1,st:2},dep);
          }
        }else if(c==='wti'){
          var hub=false,j;
          for(j=0;j<i;j++) if(tg[j].t==='circle'&&tg[j]['class']==='wt'&&tg[j].cx===a.cx&&tg[j].cy===a.cy) hub=true;
          if(!hub) add({k:'disc',x:x1,y:y1,r:r,z0:-1.4,z1:1.4,c:C.metal,st:2},P(x1,y1,0)[2]);
        }
      }
    }
  }
  function drawPrim(o){
    if(o.k==='box') box(o.cx,o.cy,o.w,o.h,o.d,o.rot,o.c,o.zc);
    else if(o.k==='tube') tube(P(o.a[0],o.a[1],o.a[2]),P(o.b[0],o.b[1],o.b[2]),o.r*sc,o.c,o.ol);
    else if(o.k==='disc') disc(o.x,o.y,o.r,o.z0,o.z1,o.c,o.hub);
    else if(o.k==='ball') ball(P(o.x,o.y,o.z),o.r*sc,o.c);
  }
  var prims=[]; parse(p.eq,false,prims); parse(p.wt,true,prims);
  prims.sort(function(a,b){return a.dp-b.dp});
  function stage(n){prims.forEach(function(o){if(o.st===n) drawPrim(o)})}

  /* ---- cuerpo ---- */
  function limb(sg,pts,o,c){
    var Pp=lpts(sg,pts,o,sc);
    cpath(g,Pp);g.fillStyle=rgba(c);g.fill();g.lineJoin='round';g.lineWidth=OL;g.strokeStyle=rgba(C.ink);g.stroke();
  }
  function mh(sg,pts,o){
    var Pp=lpts(sg,pts,o,sc);
    cpath(g,Pp);g.fillStyle=rgba(C.hl);g.fill();
    g.save();g.clip();
    var mx=(sg.a[0]+sg.b[0])/2, my=(sg.a[1]+sg.b[1])/2, rad=pmax(pts)*sc, nx=sg.nx, ny=sg.ny;
    if(nx*LS[0]+ny*LS[1]<0){nx=-nx;ny=-ny}
    g.strokeStyle='rgba(255,255,255,.38)';g.lineWidth=1.3;g.lineCap='round';
    for(var q=-1;q<=1;q+=2){g.beginPath();g.moveTo(sg.P(.18,0)[0]+nx*rad*.28*q,sg.P(.18,0)[1]+ny*rad*.28*q);g.lineTo(sg.P(.82,0)[0]+nx*rad*.28*q,sg.P(.82,0)[1]+ny*rad*.28*q);g.stroke()}
    g.restore();
    cpath(g,Pp);g.lineJoin='round';g.lineWidth=OL;g.strokeStyle=rgba(C.ink);g.stroke();
  }
  function dl(a,b,c){g.beginPath();g.moveTo(a[0],a[1]);c?g.quadraticCurveTo(c[0],c[1],b[0],b[1]):g.lineTo(b[0],b[1]);g.strokeStyle=rgba(C['skin-line'],.55);g.lineWidth=1.2;g.lineCap='round';g.stroke()}
  function shoe(f,ft,z,far){
    var a=P(f[0],f[1],z), b=P(f[0]+ft[0],f[1]+ft[1],z), c=far?dk(C.shoe,.2):C.shoe;
    tube(a,b,3.9*sc*.55+1.2,c);
  }
  var s=p.s, pp=p.p, k=p.k, f=p.f, hh=p.h, e=p.e, w=p.w, ft=p.ft||[8,0];
  var ZS=5, ZH=3.2;
  function seg(a,b,za,zb){return SEG(P(a[0],a[1],za),P(b[0],b[1],zb),fd)}
  /* suelo: elipse plana como en la foto de referencia */
  (function(){
    var rc=R3.rec; R3.rec=null;
    var xs=[pp[0],f[0],k[0],s[0],hh[0]], m, re=/(?:\bx1|\bx2|\bcx|\bx)="(-?[\d.]+)"/g, ws=/ width="([\d.]+)"/g, str=(p.eq||'');
    while((m=re.exec(str))) xs.push(parseFloat(m[1]));
    var mn=Math.min.apply(null,xs), mx=Math.max.apply(null,xs);
    mn=Math.max(mn,-6); mx=Math.min(mx,106);
    var cx0=(mn+mx)/2+1, rx=Math.max(30,(mx-mn)/2+14), c0=P(cx0,108,0);
    g.save();g.translate(c0[0],c0[1]+2);g.scale(1,.27);
    g.fillStyle=rgba(C['ill-floor']);g.beginPath();g.arc(0,0,Math.min(rx*sc,PW*.45),0,6.2832);g.fill();g.restore();
    R3.rec=rc;
  })();
  stage(2);
  /* extremidades lejanas */
  var skin=C.skin, skin2=C.skin2;
  var fk=p.k2||k, ff=p.f2||f, THs, SHs;
  THs=seg(pp,fk,-ZH,-ZH); SHs=seg(fk,ff,-ZH,-ZH);
  limb(THs,THIGH,null,skin2);limb(SHs,SHIN,null,skin2);shoe(ff,ft,-ZH,1);
  limb(THs,THIGH,{t0:-.1,t1:.54,fs:1.06,bs:1.06,round:1},dk(C.shorts,.12));
  if(e){
    var e2=p.e2||e, w2=p.w2||w, sh2=P(s[0],s[1],-ZS);
    ball(sh2,5.3*sc*.92,skin2);
    var UA2=seg(s,e2,-ZS,-ZS), FA2=seg(e2,w2,-ZS,-ZS);
    limb(UA2,UARM,null,skin2);limb(FA2,FARM,null,skin2);
    ball(P(w2[0],w2[1],-ZS),3.2*sc*.92,skin2);
  }
  /* cuello + tronco */
  var T=seg(s,pp,0,0);
  tube(P(s[0],s[1],0),P(hh[0],hh[1],0),3.3*sc,mixc(skin,skin2,.25));
  limb(T,TORSO,null,skin);
  limb(T,TORSO,{t0:.84,t1:1.14,fs:1.08,bs:1.08,round:1},C.shorts);
  var B1=function(t,o){return T.P(t,o*sc)};
  dl(B1(.42,6.2),B1(.2,1.2),B1(.3,3.6));
  [.54,.68,.82].forEach(function(t){var w0=prof(TORSO,t)[0];dl(B1(t,w0-.5),B1(t,w0-3.8))});
  dl(B1(.22,-5.6),B1(.78,-6.4),B1(.5,-4.6));
  dl(B1(.9,-7.2),B1(1.13,-2.4),B1(1.12,-6.6));
  if(has('chest')) mh(T,TORSO,{t0:.06,t1:.5,fs:1,bs:.3,round:1});
  if(has('back')) mh(T,TORSO,{t0:.06,t1:.9,fs:.2,bs:1,round:1});
  if(has('abs')) mh(T,TORSO,{t0:.46,t1:.96,fs:.85,bs:.18,round:1});
  if(has('trap')) mh(T,TORSO,{t0:-.1,t1:.26,fs:.7,bs:.95,round:1});
  if(has('glute')) mh(T,TORSO,{t0:.84,t1:1.14,fs:.2,bs:.95,round:1});
  /* pierna cercana */
  var TH=seg(pp,k,ZH,ZH), SH=seg(k,f,ZH,ZH);
  limb(TH,THIGH,null,skin);limb(SH,SHIN,null,skin);shoe(f,ft,ZH,0);
  limb(TH,THIGH,{t0:-.1,t1:.54,fs:1.06,bs:1.06,round:1},C.shorts);
  var kp=TH.P(1.0,3.4*sc);
  ball(kp,2.6*sc,skin);
  dl(TH.P(.26,3.4*sc),TH.P(.86,2.4*sc),TH.P(.55,4.2*sc));
  dl(SH.P(.14,-4.6*sc),SH.P(.6,-2.4*sc),SH.P(.34,-6.2*sc));
  if(has('quad')) mh(TH,THIGH,{t0:.08,t1:.98,fs:1.06,bs:.4,round:1});
  if(has('ham')) mh(TH,THIGH,{t0:.08,t1:.98,fs:.35,bs:1.06,round:1});
  if(has('calf')) mh(SH,SHIN,{t0:.08,t1:.72,fs:.2,bs:.95,round:1});
  ball(P(pp[0],pp[1],ZH),4.5*sc*.8,C.shorts);
  /* cuello */
  /* brazo cercano */
  if(e){
    var sh1=P(s[0],s[1],ZS), UA=seg(s,e,ZS,ZS), FA=seg(e,w,ZS,ZS);
    limb(UA,UARM,null,skin);limb(FA,FARM,null,skin);
    ball(sh1,5.4*sc*.92,skin);
    if(has('delts')){ball(sh1,5.2*sc*.92,C.hl)}
    if(has('arm')) mh(UA,UARM,{t0:.1,t1:.96,fs:.9,bs:.9,round:1});
    if(has('fore')) mh(FA,FARM,{t0:.08,t1:.92,fs:.9,bs:.9,round:1});
    dl(UA.P(.14,3*sc),UA.P(.5,1.2*sc),UA.P(.3,2.6*sc));
    ball(P(w[0],w[1],ZS),3.5*sc*.9,skin);
  }
  /* cabeza */
  var Tn=SEG(s,pp,fd), H=P(hh[0],hh[1],0), rH=7.9*sc, S0=P(s[0],s[1],0);
  var nose=P(hh[0]+Tn.nx*7.4,hh[1]+Tn.ny*7.4,0), nvx=nose[0]-H[0], nvy=nose[1]-H[1], nl=Math.sqrt(nvx*nvx+nvy*nvy)||1;
  var ux=H[0]-S0[0], uy=H[1]-S0[1], ul=Math.sqrt(ux*ux+uy*uy)||1; ux/=ul; uy/=ul;
  ball(P(hh[0]-Tn.nx*1.2,hh[1]-Tn.ny*1.2,ZS+1.3),1.7*sc,skin2);
  ball(H,rH,skin);
  g.save();g.beginPath();g.arc(H[0],H[1],rH,0,6.2832);g.clip();
  var hx=ux-nvx/nl*.55, hy=uy-nvy/nl*.55, hn=Math.sqrt(hx*hx+hy*hy)||1; hx/=hn; hy/=hn;
  var px=-hy, py=hx, d0=.2*rH, Q=3*rH;
  g.beginPath();g.moveTo(H[0]+hx*d0+px*Q,H[1]+hy*d0+py*Q);g.lineTo(H[0]+hx*d0-px*Q,H[1]+hy*d0-py*Q);
  g.lineTo(H[0]+hx*Q-px*Q,H[1]+hy*Q-py*Q);g.lineTo(H[0]+hx*Q+px*Q,H[1]+hy*Q+py*Q);g.closePath();
  g.fillStyle=rgba(C.hair);g.fill();
  g.restore();
  g.beginPath();g.arc(H[0],H[1],rH,0,6.2832);g.lineWidth=OL;g.strokeStyle=rgba(C.ink);g.stroke();
  ball(nose,1.7*sc,mixc(skin,skin2,.2));
  var e1=P(hh[0]+Tn.nx*5.4+Tn.ux*-1.2,hh[1]+Tn.ny*5.4+Tn.uy*-1.2,2.6), e2p=P(hh[0]+Tn.nx*5.4-Tn.ux*1.2,hh[1]+Tn.ny*5.4-Tn.uy*1.2,-2.6);
  g.fillStyle=rgba(C.ink);g.beginPath();g.arc(e1[0],e1[1],1.15*sc*.5,0,6.2832);g.fill();
  g.beginPath();g.arc(e2p[0],e2p[1],.9*sc*.5,0,6.2832);g.fill();
  stage(8);
}

function r3fake(){
  var f=function(){return px}, px=new Proxy(f,{get:function(){return px},set:function(){return true},apply:function(){return px}});
  return px;
}
function r3fit(ps){
  var PW=R3.PW, PH=R3.PH, per=[], w=0, h=0, k, i;
  if(!R3.fake) R3.fake=r3fake();
  for(i=0;i<2;i++){
    R3.rec=[]; 
    try{panel3(R3.fake,ps[i],!!ps[i].e,null)}catch(e){}
    var r=R3.rec, b=[1e9,1e9,-1e9,-1e9];
    r.forEach(function(q){b[0]=Math.min(b[0],q[0]);b[1]=Math.min(b[1],q[1]);b[2]=Math.max(b[2],q[0]);b[3]=Math.max(b[3],q[1])});
    R3.rec=null; per.push(b);
    w=Math.max(w,b[2]-b[0]+34); h=Math.max(h,b[3]-b[1]+46);
  }
  k=Math.max(.7,Math.min(1.5,Math.min(PW*.92/w,PH*.7/h)));
  return per.map(function(b){
    var cx=(b[0]+b[2])/2, cy=(b[1]+b[3])/2;
    return {k:k,ox:PW/2-(cx-PW/2)*k,oy:PH*.5-(cy-PH*.52)*k};
  });
}
var MNAME={chest:'Pecho',back:'Espalda',abs:'Abdomen',trap:'Trapecio',glute:'Glúteo',quad:'Cuádriceps',ham:'Isquios',calf:'Gemelo',delts:'Hombro',arm:'Brazo',fore:'Antebrazo'};
function r3draw(id){
  var ps=POSES[id], PW=R3.PW, PH=R3.PH, Q=R3.Q, cv=document.createElement('canvas'), g, i, C=R3.col, fits=r3fit(ps);
  cv.width=Math.round(PW*2*Q); cv.height=Math.round(PH*Q); g=cv.getContext('2d'); g.scale(Q,Q);
  g.fillStyle=rgba(C['ill-bg']);g.fillRect(0,0,PW*2,PH);
  for(i=0;i<2;i++){
    g.save();g.translate(i*PW,0);g.beginPath();g.rect(0,0,PW,PH);g.clip();
    panel3(g,ps[i],!!ps[i].e,fits[i]);
    g.restore();
  }
  g.strokeStyle=rgba(C['ill-floor'],1);g.lineWidth=2;g.setLineDash([]);
  g.beginPath();g.moveTo(PW,14);g.lineTo(PW,PH-14);g.stroke();g.setLineDash([]);
  [['INICIO',14],['FINAL',PW+14]].forEach(function(l){
    g.font='700 17px system-ui,-apple-system,Segoe UI,Roboto,sans-serif';
    var tw=g.measureText(l[0]).width+20;
    g.fillStyle=rgba(C.ink,.78);g.beginPath();
    if(g.roundRect) g.roundRect(l[1],PH-40,tw,26,13); else g.rect(l[1],PH-40,tw,26);
    g.fill();
    g.fillStyle=rgba(C['ill-bg']);g.textBaseline='middle';g.fillText(l[0],l[1]+10,PH-26);
  });
  var hl=(ps[0].hl||[]).map(function(k){return MNAME[k]}).filter(Boolean);
  if(hl.length){
    g.font='700 15px system-ui,-apple-system,Segoe UI,Roboto,sans-serif'; g.textBaseline='middle';
    var tx=hl.join(' · '), tw2=g.measureText(tx).width+38;
    g.fillStyle=rgba(C.hl,.16);g.beginPath();
    if(g.roundRect) g.roundRect(12,12,tw2,26,13); else g.rect(12,12,tw2,26);
    g.fill();
    g.fillStyle=rgba(C.hl);g.beginPath();g.arc(27,25,6,0,6.2832);g.fill();
    g.fillStyle=rgba(mixc(C.hl,C.ink,.35));g.fillText(tx,40,26);
  }
  return cv;
}
function fig(id){
  return '<div class="fig3" data-id="'+id+'" role="img" aria-label="'+esc(EX[id].n)+': posición inicial y posición final"></div>';
}
function r3set(node,url){
  var im=node.firstChild;
  if(!im||im.tagName!=='IMG'){im=document.createElement('img');im.alt='';im.decoding='async';node.appendChild(im)}
  im.src=url;node.setAttribute('data-d','1');
}
function r3pump(){
  if(R3.busy||!R3.q.length) return;
  R3.busy=1;
  requestAnimationFrame(function(){
    var t0=Date.now(), j, key, url;
    try{r3cols()}catch(e){}
    while(R3.q.length&&Date.now()-t0<22){
      j=R3.q.shift();
      if(!j.node.isConnected) continue;
      key=j.id+'|'+R3.sig;
      try{
        url=R3.cache[key]||(R3.cache[key]=r3draw(j.id).toDataURL('image/jpeg',.9));
        r3set(j.node,url);
      }catch(err){
        R3.bad=1; j.node.innerHTML=fig2(j.id); j.node.setAttribute('data-d','1');
      }
    }
    R3.busy=0; r3pump();
  });
}
function r3want(node){
  if(node.__q) return; node.__q=1;
  R3.q.push({node:node,id:node.getAttribute('data-id')}); r3pump();
}
function hydrate3D(){
  var ns=document.querySelectorAll('.fig3:not([data-d])'), i, n;
  if(!ns.length) return;
  try{r3cols()}catch(e){}
  for(i=0;i<ns.length;i++){
    n=ns[i];
    var key=n.getAttribute('data-id')+'|'+R3.sig;
    if(R3.cache[key]){r3set(n,R3.cache[key]);continue}
    if('IntersectionObserver' in window){
      if(!R3.io) R3.io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){R3.io.unobserve(en.target);r3want(en.target)}})},{rootMargin:'500px 0px'});
      R3.io.observe(n);
    }else r3want(n);
  }
}
(function(){
  var pend=0;
  function kick(){if(pend) return; pend=1; Promise.resolve().then(function(){pend=0;hydrate3D()})}
  if(window.MutationObserver){
    new MutationObserver(kick).observe(document.documentElement,{childList:true,subtree:true});
    new MutationObserver(function(){
      [].forEach.call(document.querySelectorAll('.fig3[data-d]'),function(n){n.removeAttribute('data-d');n.__q=0});
      kick();
    }).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','data-acc']});
  }
  if(window.matchMedia) try{window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(){
    [].forEach.call(document.querySelectorAll('.fig3[data-d]'),function(n){n.removeAttribute('data-d');n.__q=0});kick();
  })}catch(e){}
})();

var MC={'Pecho':'--c-push','Espalda':'--c-pull','Espalda y pierna':'--c-pull','Pierna':'--c-legs','Isquios':'--c-legs','Gemelo':'--c-legs','Glúteo':'--c-legs','Hombro':'--c-shoulder','Hombro posterior':'--c-shoulder','Bíceps':'--c-arms','Tríceps':'--c-arms','Dorsal':'--c-pull','Abdomen':'--c-core','Trapecio':'--c-shoulder','Espalda baja':'--c-pull','Cuádriceps':'--c-legs'};
var DAYC=['var(--c-push)','var(--c-pull)','var(--c-legs)','var(--c-shoulder)','var(--c-arms)'];
function mcol(id){return 'var('+(MC[EX[id].m]||'--accent')+')'}
var T={
  bench:[.5,.75,1,1.25,1.5],
  squat:[.75,1,1.5,1.75,2.25],
  deadlift:[1,1.5,1.75,2.25,2.75],
  ohp:[.35,.5,.7,.85,1.1],
  row:[.5,.75,1,1.25,1.5]
};
function plan(days){
  if(days===3) return [
    {n:'Cuerpo completo A',e:['squat','bench','row','lateral','curl']},
    {n:'Cuerpo completo B',e:['deadlift','ohp','pulldown','thrust','pushdown']},
    {n:'Cuerpo completo C',e:['legpress','incline','row','face','calf']}];
  if(days===5) return [
    {n:'Empuje',e:['bench','ohp','incline','lateral','pushdown']},
    {n:'Tirón',e:['row','pulldown','face','curl']},
    {n:'Pierna A',e:['squat','rdl','legpress','calf']},
    {n:'Torso',e:['incline','row','ohp','pulldown','curl']},
    {n:'Pierna B',e:['deadlift','legpress','thrust','legcurl','calf']}];
  return [
    {n:'Torso A',e:['bench','row','ohp','pulldown','pushdown']},
    {n:'Pierna A',e:['squat','rdl','legcurl','calf']},
    {n:'Torso B',e:['incline','pulldown','lateral','face','curl']},
    {n:'Pierna B',e:['deadlift','legpress','thrust','calf']}];
}
var $=function(s){return document.querySelector(s)};
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function fmt(n,d){return Number(n).toLocaleString('es-ES',{maximumFractionDigits:d==null?0:d})}
function r25(x){return Math.max(2.5,Math.round(x/2.5)*2.5)}
function orm(kg,reps){return kg*(1+reps/30)}

/* ---------- cuentas y estado ---------- */
var DB=loadDB(), S=null, tab='hoy', rest=null, tick=null;
var mode='signup', draft={name:'',email:'',pass:'',bw:'78',days:4,goal:'musculo'}, confirmDel=false;
var libG='Todos', libQ='', openEx=null;
function loadDB(){
  try{var raw=localStorage.getItem(KEY); if(raw){var o=JSON.parse(raw); if(o&&o.users) return o;}}catch(e){}
  return {users:{},session:null};
}
var cloudRef=null, pushT=null, cloudResolve=null, cloudReady=new Promise(function(r){cloudResolve=r});
function userStamp(u){return (u&&u.data&&u.data.upd)||(u&&u.created)||0}
function mergeDB(a,b){
  var out={users:{},session:a.session||null,del:{},ts:Math.max(a.ts||0,b.ts||0)}, k;
  [a.del||{},b.del||{}].forEach(function(d){Object.keys(d).forEach(function(e){out.del[e]=Math.max(out.del[e]||0,d[e])})});
  [a.users||{},b.users||{}].forEach(function(us){
    Object.keys(us).forEach(function(e){
      var u=us[e], cur=out.users[e];
      if(out.del[e]&&out.del[e]>userStamp(u)) return;
      if(!cur||userStamp(u)>userStamp(cur)) out.users[e]=u;
    });
  });
  if(out.session&&!out.users[out.session]) out.session=null;
  return out;
}
function saveDB(){
  DB.ts=Date.now();
  try{localStorage.setItem(KEY,JSON.stringify(DB))}catch(e){}
  if(SUPA&&sbSess) sbPush();
  if(cloudRef){clearTimeout(pushT);pushT=setTimeout(function(){
    try{cloudRef.set({ts:DB.ts,json:JSON.stringify(DB)}).catch(function(){})}catch(e){}
  },700)}
}
function cloudPull(){
  if(!cloudRef) return Promise.resolve();
  return cloudRef.get().then(function(snap){
    var c=snap.exists?snap.data():null, o=null;
    if(c&&c.json){try{o=JSON.parse(c.json)}catch(e){}}
    if(!o||!o.users){ if(Object.keys(DB.users).length) saveDB(); return }
    var before=JSON.stringify(DB.users), merged=mergeDB(DB,o);
    DB=merged; S=DB.session?DB.users[DB.session].data:null;
    try{localStorage.setItem(KEY,JSON.stringify(DB))}catch(e){}
    if(!S) mode=Object.keys(DB.users).length?'login':'signup';
    applyAcc();
    if(JSON.stringify(DB.users)!==before){ if(!(S&&S.cur&&document.activeElement&&document.activeElement.tagName==='INPUT')) render(); }
    if(c&&(c.ts||0)<DB.ts) saveDB();
  }).catch(function(){});
}
function cloudInit(){
  if(typeof claude==='undefined'||!claude.use){cloudResolve();return}
  setTimeout(cloudResolve,6000);
  Promise.all([claude.use('user'),claude.use('db')]).then(function(r){
    var u=r[0],db=r[1]; if(!u||!db){cloudResolve();return}
    return u.id().then(function(id){
      if(!id){cloudResolve();return}
      cloudRef=db.doc('data/users/'+id+'/forja'); cloudDb=db; cloudUid=id;
      return cloudPull().then(cloudResolve);
    });
  }).catch(function(){cloudResolve()});
  document.addEventListener('visibilitychange',function(){if(!document.hidden) cloudPull()});
}
function save(){if(DB.session&&DB.users[DB.session]){S.upd=Date.now(); DB.users[DB.session].data=S} saveDB()}
function seedSessions(bw){
  var offs=[20,17,13,10,6,3], k={bench:.85,row:.75,ohp:.5,squat:1.1,deadlift:1.35}, out=[];
  offs.forEach(function(o,i){
    var f=.82+i*.03, d=new Date(); d.setDate(d.getDate()-o); d.setHours(18,0,0,0);
    var upper=i%2===0, ids=upper?['bench','row','ohp']:['squat','deadlift'];
    out.push({date:d.toISOString(),name:upper?'Torso A':'Pierna A',example:true,ex:ids.map(function(id){
      var kg=r25(bw*k[id]*f);
      return {id:id,sets:[0,1,2,3].map(function(){return {kg:kg,reps:5}})};
    })});
  });
  return out;
}
function noExamples(d){if(d&&d.sessions) d.sessions=d.sessions.filter(function(x){return !x.example}); return d}
function fresh(p){return {profile:p,dayIdx:0,sessions:[],cur:null,summary:null}}
/* ---------- cuentas en la nube (Supabase) ---------- */
var SBK='forja-supa-v1', sbSess=null, sbT=null;
try{sbSess=JSON.parse(localStorage.getItem(SBK)||'null')}catch(e){}
function sbSave(){try{if(sbSess) localStorage.setItem(SBK,JSON.stringify(sbSess)); else localStorage.removeItem(SBK)}catch(e){}}
var SUPA_BASE=String(SUPABASE_URL).trim().replace(/^['"]|['"]$/g,'').replace(/\/+$/,'').replace(/\/(rest|auth)\/v1.*$/,'');
if(SUPA_BASE&&!/^https?:\/\//.test(SUPA_BASE)) SUPA_BASE='https://'+SUPA_BASE;
var SUPA_KEYC=String(SUPABASE_KEY).trim().replace(/^['"]|['"]$/g,'');
function sbFetch(path,o,anon){
  o=o||{}; var h={apikey:SUPA_KEYC,'Content-Type':'application/json'}, k;
  for(k in (o.headers||{})) h[k]=o.headers[k];
  if(!anon&&sbSess) h.Authorization='Bearer '+sbSess.access_token;
  else if(SUPA_KEYC.indexOf('sb_')!==0) h.Authorization='Bearer '+SUPA_KEYC;
  return fetch(SUPA_BASE+path,{method:o.method||'GET',headers:h,body:o.body?JSON.stringify(o.body):undefined});
}
function sbSetSess(j){sbSess={access_token:j.access_token,refresh_token:j.refresh_token,exp:Date.now()+((j.expires_in||3600)-90)*1000,id:j.user.id,email:String(j.user.email||'').toLowerCase()};sbSave()}
function sbRefresh(){
  if(!sbSess) return Promise.reject(new Error('sin sesión'));
  if(Date.now()<sbSess.exp) return Promise.resolve();
  return sbFetch('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:sbSess.refresh_token}},true)
    .then(function(r){return r.json().then(function(j){if(!r.ok||!j.access_token) throw new Error('sesión caducada'); sbSetSess(j)})});
}
function sbMsg(j){
  var m=String((j&&(j.msg||j.error_description||j.message||j.error))||'');
  if(/invalid login/i.test(m)) return 'Correo o contraseña incorrectos.';
  if(/invalid api key|apikey|invalid jwt/i.test(m)) return 'La clave de Supabase no es válida: copia la clave "anon" o "publishable" de Project Settings > API.';
  if(/signups? (not allowed|(is |are )?disabled)/i.test(m)) return 'El registro está desactivado en Supabase (Authentication > Providers > Email).';
  if(/already registered|already exists/i.test(m)) return 'Ya existe una cuenta con ese correo. Pulsa Entrar.';
  if(/not confirmed/i.test(m)) return 'Confirma tu correo: te hemos enviado un enlace.';
  if(/password/i.test(m)&&/(least|short|weak|characters)/i.test(m)) return 'La contraseña es demasiado débil (mínimo 6 caracteres).';
  if(/rate limit|too many|security purposes/i.test(m)) return 'Demasiados intentos. Espera un minuto y vuelve a probar.';
  return m||'Error de conexión con el servidor.';
}
function sbPullRemote(){
  return sbRefresh().then(function(){return sbFetch('/rest/v1/forja_data?select=data&user_id=eq.'+sbSess.id)})
    .then(function(r){
      if(r.ok) return r.json();
      return r.json().catch(function(){return {}}).then(function(j){
        var m=String((j&&(j.message||j.msg||j.error))||'');
        if(r.status===404||/PGRST205|does not exist|schema cache/i.test(m)||(j&&(j.code==='PGRST205'||j.code==='42P01'))) throw new Error('Falta la tabla de datos: ejecuta supabase_setup.sql en el SQL Editor de Supabase.');
        if(r.status===401||r.status===403||/jwt|api key|apikey/i.test(m)) throw new Error('Supabase rechaza la clave o los permisos ('+r.status+'). '+m);
        throw new Error('Error de Supabase ('+r.status+'): '+m);
      });
    }).then(function(a){return a&&a[0]||null});
}
function sbPushNow(){
  if(!SUPA||!sbSess) return Promise.resolve(false);
  var u=DB.users[sbSess.email]; if(!u) return Promise.resolve(false);
  return sbRefresh().then(function(){
    return sbFetch('/rest/v1/forja_data?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:{user_id:sbSess.id,data:u.data,updated_at:new Date().toISOString()}});
  }).then(function(r){return r.ok}).catch(function(){return false});
}
function sbPush(){clearTimeout(sbT); sbT=setTimeout(sbPushNow,900)}
function sbAuth(email,d){
  var signup=mode==='signup', name=String(d.name).trim(), bw=parseFloat(String(d.bw).replace(',','.'));
  if(signup){
    if(!name){authError('Escribe tu nombre.');return}
    if(!(bw>30&&bw<250)){authError('Indica un peso corporal entre 30 y 250 kg.');return}
  }
  authBusy=true; setTimeout(function(){authBusy=false},10000);
  authError(signup?'Creando cuenta…':'Entrando…');
  var req=signup?sbFetch('/auth/v1/signup',{method:'POST',body:{email:email,password:d.pass,data:{name:name}}},true)
                :sbFetch('/auth/v1/token?grant_type=password',{method:'POST',body:{email:email,password:d.pass}},true);
  req.then(function(r){return r.json().then(function(j){return {ok:r.ok,j:j}})}).then(function(x){
    if(!x.ok){authError(sbMsg(x.j));authBusy=false;return}
    if(!x.j.access_token){authError('Cuenta creada. Confirma el enlace que te hemos enviado por correo y después pulsa Entrar.');authBusy=false;return}
    sbSetSess(x.j);
    return sbPullRemote().then(function(row){
      var data=row&&row.data, loc=DB.users[email];
      if(loc&&loc.remote&&loc.data&&(!data||(loc.data.upd||0)>(data.upd||0))) data=loc.data;
      if(!data){
        var nm=name||(x.j.user.user_metadata&&x.j.user.user_metadata.name)||email.split('@')[0];
        data=fresh({name:String(nm).slice(0,30),bw:bw>30&&bw<250?bw:78,days:d.days,goal:d.goal,routine:'private'});
      }
      noExamples(data);
      DB.users[email]={email:email,remote:true,created:Date.now(),data:data};
      authBusy=false; enter(email); sbPushNow();
    });
  }).catch(function(e){authError(e&&e.message&&!(e instanceof TypeError)?e.message:'No se puede conectar con Supabase. Revisa que SUPABASE_URL sea la URL del proyecto (https://xxxx.supabase.co) y tu conexión.');authBusy=false});
}
function sbBoot(){
  if(!SUPA||!sbSess||DB.session!==sbSess.email||!DB.users[DB.session]) return;
  sbPullRemote().then(function(row){
    var u=DB.users[sbSess&&sbSess.email]; if(!u||!row||!row.data) return;
    if((row.data.upd||0)>(u.data.upd||0)){
      u.data=noExamples(row.data); S=u.data; try{localStorage.setItem(KEY,JSON.stringify(DB))}catch(e){}; applyAcc();
      if(!(S&&S.cur&&document.activeElement&&document.activeElement.tagName==='INPUT')) render();
    } else if((u.data.upd||0)>(row.data.upd||0)) sbPushNow();
  }).catch(function(){});
}
function sbLogout(){
  if(!SUPA||!sbSess) return;
  var em=sbSess.email; clearTimeout(sbT);
  sbPushNow().then(function(ok){
    if(ok){delete DB.users[em]; try{localStorage.setItem(KEY,JSON.stringify(DB))}catch(e){}}
    sbSess=null; sbSave();
  });
}
function sbDelete(){
  if(!SUPA||!sbSess) return;
  clearTimeout(sbT);
  sbRefresh().then(function(){return sbFetch('/rest/v1/rpc/delete_my_account',{method:'POST',body:{}})})
    .then(function(r){if(!r.ok) return sbFetch('/rest/v1/forja_data?user_id=eq.'+sbSess.id,{method:'DELETE'})})
    .catch(function(){}).then(function(){sbSess=null; sbSave()});
}
document.addEventListener('visibilitychange',function(){if(!document.hidden) sbBoot()});
function enter(email){
  DB.session=email; S=DB.users[email].data; saveDB(); applyAcc(); tab='hoy'; confirmDel=false;
  draft={name:'',email:'',pass:'',bw:'78',days:4,goal:'musculo'}; render(); window.scrollTo(0,0);
}
function sha256js(bytes){
  var K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  var H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  var l=bytes.length, n=((l+9+63)>>6)<<6, m=new Uint8Array(n), i, j, w=new Array(64);
  m.set(bytes); m[l]=0x80;
  var hi=Math.floor(l*8/4294967296), lo=(l*8)>>>0;
  m[n-8]=hi>>>24;m[n-7]=hi>>>16;m[n-6]=hi>>>8;m[n-5]=hi;m[n-4]=lo>>>24;m[n-3]=lo>>>16;m[n-2]=lo>>>8;m[n-1]=lo;
  function R(x,c){return (x>>>c)|(x<<(32-c))}
  for(i=0;i<n;i+=64){
    for(j=0;j<16;j++) w[j]=(m[i+j*4]<<24)|(m[i+j*4+1]<<16)|(m[i+j*4+2]<<8)|m[i+j*4+3];
    for(j=16;j<64;j++){var s0=R(w[j-15],7)^R(w[j-15],18)^(w[j-15]>>>3), s1=R(w[j-2],17)^R(w[j-2],19)^(w[j-2]>>>10); w[j]=(w[j-16]+s0+w[j-7]+s1)|0}
    var a=H[0],b=H[1],c=H[2],d=H[3],e=H[4],f=H[5],g=H[6],h=H[7];
    for(j=0;j<64;j++){
      var S1=R(e,6)^R(e,11)^R(e,25), ch=(e&f)^(~e&g), t1=(h+S1+ch+K[j]+w[j])|0, S0=R(a,2)^R(a,13)^R(a,22), mj=(a&b)^(a&c)^(b&c), t2=(S0+mj)|0;
      h=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0;
    }
    H[0]=(H[0]+a)|0;H[1]=(H[1]+b)|0;H[2]=(H[2]+c)|0;H[3]=(H[3]+d)|0;H[4]=(H[4]+e)|0;H[5]=(H[5]+f)|0;H[6]=(H[6]+g)|0;H[7]=(H[7]+h)|0;
  }
  return H.map(function(x){return ('00000000'+(x>>>0).toString(16)).slice(-8)}).join('');
}
function utf8(str){
  if(window.TextEncoder) return new TextEncoder().encode(str);
  var u=unescape(encodeURIComponent(str)), o=new Uint8Array(u.length), i; for(i=0;i<u.length;i++) o[i]=u.charCodeAt(i); return o;
}
function hash(salt,pw){
  var b=utf8(salt+':'+pw);
  try{
    if(window.crypto&&crypto.subtle&&crypto.subtle.digest){
      return crypto.subtle.digest('SHA-256',b).then(function(d){
        return Array.from(new Uint8Array(d)).map(function(x){return x.toString(16).padStart(2,'0')}).join('');
      }).catch(function(){return sha256js(b)});
    }
  }catch(e){}
  return Promise.resolve(sha256js(b));
}
function randSalt(){
  var a=new Uint8Array(12), i;
  try{crypto.getRandomValues(a)}catch(e){for(i=0;i<12;i++) a[i]=Math.floor(Math.random()*256)}
  return Array.from(a).map(function(x){return x.toString(16).padStart(2,'0')}).join('');
}
Object.keys(DB.users).forEach(function(k){noExamples(DB.users[k].data)});
if(DB.session&&DB.users[DB.session]) S=DB.users[DB.session].data; else DB.session=null;

/* ---------- lógica de entrenamiento ---------- */
function getPlan(){var c=S.profile.custom; return (c&&c.length)?c:plan(S.profile.days)}
function clonePlan(){return plan(S.profile.days).map(function(d){return {n:d.n,e:d.e.slice()}})}
var editPlan=false, hoyOpen=-1;
function touchPlan(){var c=S.cur; if(c&&c.rows.some(function(r){return r.sets.some(function(x){return x.done})})) return; S.cur=null}
function cust(){if(!S.profile.custom) S.profile.custom=clonePlan(); return S.profile.custom}
function lastOf(id){
  for(var i=S.sessions.length-1;i>=0;i--){
    var s=S.sessions[i];
    for(var j=0;j<s.ex.length;j++) if(s.ex[j].id===id) return s.ex[j];
  }
  return null;
}
function target(id){
  var g=GOALS[S.profile.goal], o=S.profile.cfg&&S.profile.cfg[id], t=EX[id].main?{sets:4,reps:g.main}:{sets:3,reps:g.acc};
  return o?{sets:o.sets||t.sets,reps:o.reps||t.reps}:t;
}
function setCfg(id,k,d){
  var t=target(id); if(!S.profile.cfg) S.profile.cfg={};
  var o=S.profile.cfg[id]=S.profile.cfg[id]||{sets:t.sets,reps:t.reps};
  o[k]=Math.max(1,Math.min(k==='sets'?10:50,(o[k]||t[k])+d));
}
function suggest(id){
  var t=target(id), l=lastOf(id);
  if(!l){return r25(S.profile.bw*EX[id].k*(S.profile.goal==='fuerza'?1:.85))}
  var top=Math.max.apply(null,l.sets.map(function(s){return s.kg}));
  var hit=l.sets.every(function(s){return s.reps>=t.reps});
  return hit?top+2.5:top;
}
function ensureCur(){
  if(S.cur||S.summary) return;
  var pl=getPlan(), day=pl[S.dayIdx%pl.length];
  S.cur={dayIdx:S.dayIdx%pl.length,name:day.n,rows:day.e.map(function(id){
    var t=target(id), kg=suggest(id);
    return {id:id,sets:Array.apply(null,Array(t.sets)).map(function(){return {kg:kg,reps:t.reps,done:false}})};
  })};
  save();
}
function bestSet(id,list){
  var b=null;
  list.forEach(function(s){s.ex.forEach(function(e){ if(e.id===id) e.sets.forEach(function(x){
    var o=orm(x.kg,x.reps); if(!b||o>b.o||(o===b.o&&x.kg>b.kg)) b={kg:x.kg,reps:x.reps,o:o,date:s.date};
  })})});
  return b;
}
function streakWeeks(){
  var set={}; S.sessions.forEach(function(x){set[mondayOf(new Date(x.date)).getTime()]=1});
  var d=mondayOf(new Date()), n=0;
  if(!set[d.getTime()]) d.setDate(d.getDate()-7);
  while(set[d.getTime()]){n++;d.setDate(d.getDate()-7)}
  return n;
}
function mondayOf(d){var x=new Date(d);x.setDate(x.getDate()-((x.getDay()+6)%7));x.setHours(0,0,0,0);return x}
function vol(s){return s.ex.reduce(function(a,e){return a+e.sets.reduce(function(b,x){return b+x.kg*x.reps},0)},0)}
function best(id,list){
  var m=0;
  list.forEach(function(s){s.ex.forEach(function(e){ if(e.id===id) e.sets.forEach(function(x){m=Math.max(m,orm(x.kg,x.reps))}) })});
  return m;
}
function rankOf(id,o,bw){
  var t=T[id], ratio=bw?o/bw:0, lv=0;
  for(var i=0;i<t.length;i++) if(ratio>=t[i]) lv=i+1;
  var prev=lv===0?0:t[lv-1], next=lv<5?t[lv]:null;
  return {lv:lv,ratio:ratio,next:next,pct:next?Math.max(0,Math.min(1,(ratio-prev)/(next-prev))):1,missing:next?Math.max(0,next*bw-o):0};
}

/* ---------- vistas ---------- */
function hasExamples(){return S.sessions.some(function(s){return s.example})}
function examplesNotice(){
  if(!hasExamples()) return '';
  return '<div class="notice"><p class="small">Ves sesiones de ejemplo para que puedas probar la app. No cuentan para tu ranking.</p><button type="button" class="btn ghost small" data-act="clear-examples">Borrar ejemplos</button></div>';
}
var CHK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

function vAuth(){
  var d=draft, su=mode==='signup';
  var out='<section class="hero"><span class="label">Tu gimnasio, tu progreso</span><h2>Registra series.<br>Sube de rango.</h2>'+
    '<div class="strip" aria-hidden="true">'+RANKS.map(function(r){return '<span>'+r+'</span>'}).join('')+'</div></section>';
  out+='<section class="card stack"><div class="seg two" role="group" aria-label="Acceso">'+
    '<button type="button" id="m-signup" data-act="mode" data-v="signup" aria-pressed="'+su+'">Crear cuenta</button>'+
    '<button type="button" id="m-login" data-act="mode" data-v="login" aria-pressed="'+(!su)+'">Entrar</button></div>'+
    '<form id="authForm" class="stack" novalidate>';
  if(su) out+='<div class="field"><label class="label" for="a-name">Nombre</label><input id="a-name" type="text" autocomplete="name" value="'+esc(d.name)+'" data-a="name" placeholder="Tu nombre"></div>';
  out+='<div class="field"><label class="label" for="a-email">Correo</label><input id="a-email" type="email" autocomplete="email" value="'+esc(d.email)+'" data-a="email" placeholder="nombre@correo.com"></div>'+
    '<div class="field"><label class="label" for="a-pass">Contraseña</label><input id="a-pass" type="password" autocomplete="'+(su?'new-password':'current-password')+'" value="'+esc(d.pass)+'" data-a="pass" placeholder="Mínimo 6 caracteres"></div>';
  if(su){
    out+='<div class="field"><label class="label" for="a-bw">Peso corporal (kg)</label><input id="a-bw" type="text" inputmode="decimal" value="'+esc(d.bw)+'" data-a="bw"></div>'+
      '<div class="field"><span class="label">Días por semana</span><div class="seg">'+[3,4,5].map(function(n){return '<button type="button" id="ad-'+n+'" data-act="adays" data-v="'+n+'" aria-pressed="'+(d.days===n)+'">'+n+' días</button>'}).join('')+'</div></div>'+
      '<div class="field"><span class="label">Objetivo</span><div class="seg">'+Object.keys(GOALS).map(function(g){return '<button type="button" id="ag-'+g+'" data-act="agoal" data-v="'+g+'" aria-pressed="'+(d.goal===g)+'">'+GOALS[g].n+'</button>'}).join('')+'</div></div>';
  }
  out+='<p id="err" class="err" role="alert"></p><button type="submit" class="btn" id="a-go">'+(su?'Crear cuenta y empezar':'Entrar')+'</button></form>'+
    '<p class="small muted">'+(SUPA?'Tu cuenta y tus datos se sincronizan entre tus dispositivos.':'Las cuentas se guardan solo en este navegador y no se envían a ningún servidor.')+'</p></section>';
  return out;
}

function vHoy(){
  var pl=getPlan(), p=S.profile, out='';
  var weekStart=mondayOf(new Date()), wk=S.sessions.filter(function(s){return new Date(s.date)>=weekStart});
  var wkVol=wk.reduce(function(a,s){return a+vol(s)},0);
  var stats='<div class="stats"><div class="stat a"><span class="label">Esta semana</span><b class="num">'+wk.length+' / '+pl.length+'</b><span class="small muted">sesiones</span></div>'+
    '<div class="stat b"><span class="label">Volumen</span><b class="num">'+fmt(wkVol/1000,1)+' t</b><span class="small muted">levantadas</span></div></div>';
  if(S.summary){
    var m=S.summary, ups='';
    if(m.ups.length) ups='<div class="up">'+m.ups.map(function(u){return '<div>Subes a <b>'+u.rank+'</b> en '+esc(u.ex)+'</div>'}).join('')+'</div>';
    if(m.prs&&m.prs.length) ups+='<div class="up">'+m.prs.map(function(u){return '<div>🏆 Récord en <b>'+esc(u.ex)+'</b>: '+fmt(u.kg,1)+' kg × '+u.reps+'</div>'}).join('')+'</div>';
    ups+='<div class="up"><div>⭐ <b>+'+fmt(m.pts||0)+'</b> puntos Forja</div>'+(m.lg>=0?'<div>🎖️ ¡Subes al rango <b>'+LEAGUES[m.lg].n+'</b>!</div>':'')+'</div>';
    var nx=pl[S.dayIdx%pl.length];
    out+='<section class="hero"><span class="label">Sesión terminada</span><h2>'+esc(m.name)+'</h2><p>Buen trabajo'+(p.name?', '+esc(p.name):'')+'.</p></section>'+
      '<div class="card"><div class="stats"><div class="stat a"><span class="label">Volumen</span><b class="num">'+fmt(m.vol)+' kg</b></div><div class="stat b"><span class="label">Series</span><b class="num">'+m.sets+'</b></div></div>'+ups+
      '<p class="muted" style="margin:14px 0">Siguiente sesión: <b style="color:var(--fg)">'+esc(nx.n)+'</b></p>'+
      '<button type="button" class="btn" data-act="next">Preparar siguiente sesión</button></div>'+stats;
    return out;
  }
  ensureCur();
  var c=S.cur;
  var dt=new Date().toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'});
  var totS=c.rows.reduce(function(a,r){return a+r.sets.length},0), dnS=c.rows.reduce(function(a,r){return a+r.sets.filter(function(x){return x.done}).length},0);
  var pct=totS?Math.round(100*dnS/totS):0, mins=Math.max(10,Math.round(totS*2.7/5)*5);
  var muscles=[]; c.rows.forEach(function(r){var m=EX[r.id].m; if(muscles.indexOf(m)<0) muscles.push(m)});
  out+='<section class="hero hoy"><div class="hoy-top"><div><span class="label">'+esc(dt)+'</span><h2>'+esc(c.name)+'</h2></div>'+
    '<div class="ring" id="hp-ring" style="--p:'+pct+'" role="img" aria-label="Progreso de la sesión"><b class="num" id="hp-pct">'+pct+'%</b></div></div>'+
    '<p><span id="hp-sets" class="num">'+dnS+' / '+totS+'</span> series · '+c.rows.length+' ejercicios · ~'+mins+' min</p>'+
    '<div class="strip">'+muscles.map(function(m){return '<span>'+esc(m)+'</span>'}).join('')+'</div></section>';
  var ws=mondayOf(new Date()), dl=['L','M','X','J','V','S','D'], todayI=(new Date().getDay()+6)%7;
  out+='<section class="card week" aria-label="Semana"><div class="week-row">'+dl.map(function(l,k){
    var d0=new Date(ws); d0.setDate(d0.getDate()+k); var d1=new Date(d0); d1.setDate(d1.getDate()+1);
    var tr=S.sessions.some(function(x){var t=new Date(x.date);return t>=d0&&t<d1});
    return '<div class="wd'+(tr?' on':'')+(k===todayI?' now':'')+'"><span>'+l+'</span><i>'+(tr?CHK:'')+'</i></div>';
  }).join('')+'</div>'+(streakWeeks()?'<p class="small" style="margin-top:10px;text-align:center"><b>Racha de '+streakWeeks()+' semana'+(streakWeeks()===1?'':'s')+'</b> <span class="muted">entrenando</span></p>':'')+'</section>';
  out+=stats+examplesNotice();
  if(pl.length>1&&!c.rows.some(function(r){return r.sets.some(function(x){return x.done})})){
    out+='<div class="filters" role="group" aria-label="Elegir día">'+pl.map(function(d,k){return '<button type="button" data-act="pick" data-i="'+k+'" aria-pressed="'+(k===c.dayIdx)+'">'+(k+1)+'. '+esc(d.n)+'</button>'}).join('')+'</div>';
  }
  c.rows.forEach(function(r,i){
    var e=EX[r.id], t=target(r.id), l=lastOf(r.id), doneN=r.sets.filter(function(s){return s.done}).length, col=mcol(r.id);
    var lastTxt=l?'Última: '+fmt(Math.max.apply(null,l.sets.map(function(s){return s.kg})),1)+' kg':'Primera vez';
    var prevTxt=l?'Anterior: '+l.sets.map(function(x){return fmt(x.kg,1)+'×'+x.reps}).join(' · '):'';
    var opened=hoyOpen===i, inf=INFO[r.id];
    out+='<section class="card" aria-label="'+esc(e.n)+'"><div class="ex-head"><div><span class="chip" style="--c:'+col+'">'+esc(e.m)+'</span><h3>'+esc(e.n)+'</h3><p class="small muted">'+t.sets+'×'+t.reps+' · '+lastTxt+'</p>'+(prevTxt?'<p class="small muted">'+esc(prevTxt)+'</p>':'')+((S.profile.notes&&S.profile.notes[r.id]&&!opened)?'<p class="small notepv">📝 '+esc(S.profile.notes[r.id])+'</p>':'')+'</div><span class="count num" id="cnt-'+i+'">'+doneN+'/'+r.sets.length+'</span></div>'+
      '<div class="meter" style="color:'+col+';margin-bottom:10px" aria-hidden="true"><i id="mt-'+i+'" style="width:'+Math.round(100*doneN/r.sets.length)+'%"></i></div>'+
      '<div class="set hd"><span></span><span style="text-align:center">kg</span><span style="text-align:center">reps</span><span></span></div>';
    r.sets.forEach(function(s,j){
      out+='<div class="set'+(s.done?' done':'')+'" id="row-'+i+'-'+j+'"><span class="n">'+(j+1)+'</span>'+
        '<input id="kg-'+i+'-'+j+'" type="text" inputmode="decimal" value="'+s.kg+'" data-set="'+i+'.'+j+'.kg" aria-label="Kilos serie '+(j+1)+'">'+
        '<input id="rp-'+i+'-'+j+'" type="text" inputmode="numeric" value="'+s.reps+'" data-set="'+i+'.'+j+'.reps" aria-label="Repeticiones serie '+(j+1)+'">'+
        '<button type="button" class="chk" data-act="done" data-i="'+i+'" data-j="'+j+'" aria-pressed="'+s.done+'" aria-label="Serie '+(j+1)+' hecha">'+CHK+'</button></div>';
    });
    out+='<div class="rowb" style="margin-top:8px"><button type="button" class="add-set" data-act="addset" data-i="'+i+'">+ Serie</button>'+
      '<span class="stepper"><button type="button" class="btn ghost small" data-act="kgadj" data-i="'+i+'" data-d="-2.5" aria-label="Bajar 2,5 kilos">−2,5 kg</button>'+
      '<button type="button" class="btn ghost small" data-act="kgadj" data-i="'+i+'" data-d="2.5" aria-label="Subir 2,5 kilos">+2,5 kg</button></span></div>'+
      '<button type="button" class="howto" data-act="howto" data-i="'+i+'" aria-expanded="'+opened+'">'+(opened?'Menos opciones':'Descanso, nota y técnica')+'</button>'+
      (opened?'<div class="howto-body">'+((inf&&/barra/i.test(inf.eq)&&r.sets[0]&&plates(r.sets[0].kg))?'<p class="small plates">🏋️ <b>Discos por lado</b> (barra de 20 kg): '+plates(r.sets[0].kg).join(' + ')+' kg</p>':'')+'<div class="rowb small" style="margin-top:8px"><span class="muted">Descanso</span><span class="stepper"><button type="button" class="btn ghost small" data-act="restex" data-id="'+r.id+'" data-d="-15" aria-label="Menos descanso">−</button><b class="num" style="min-width:44px;text-align:center">'+mmss(restFor(r.id))+'</b><button type="button" class="btn ghost small" data-act="restex" data-id="'+r.id+'" data-d="15" aria-label="Más descanso">+</button></span></div>'+
      '<textarea class="note" rows="2" maxlength="300" data-note="'+r.id+'" aria-label="Nota de '+esc(e.n)+'" placeholder="Nota (ajustes de la máquina, sensaciones…)">'+esc((S.profile.notes&&S.profile.notes[r.id])||'')+'</textarea>'+(POSES[r.id]?fig(r.id,col):'')+(inf&&inf.tips?'<ul class="tips">'+inf.tips.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>':'')+'</div>':'')+'</section>';
  });
  out+='<button type="button" class="btn" data-act="finish">Terminar sesión</button><p id="msg" class="small muted" role="status">Solo cuentan las series marcadas como hechas.</p>';
  return out;
}

function exOptions(day){
  return Object.keys(EX).filter(function(id){return day.e.indexOf(id)<0}).sort(function(x,y){return EX[x].n.localeCompare(EX[y].n,'es')})
    .map(function(id){return '<option value="'+id+'">'+esc(EX[id].n)+' · '+esc(EX[id].m)+'</option>'}).join('');
}
function vPlan(){
  var pl=getPlan(), g=GOALS[S.profile.goal], cur=S.dayIdx%pl.length, ed=editPlan, cu=!!S.profile.custom;
  var out='<section class="hero"><span class="label">'+pl.length+' días por semana · '+g.n+(cu?' · Personalizada':'')+'</span><h2>Tu plan</h2><p>'+
    (ed?'Modo edición: cambia nombres, ejercicios, series y repeticiones. Se guarda solo.':'Rutina generada a partir de tu perfil. Pulsa Personalizar para ajustarla a tu gusto.')+'</p>'+
    '<button type="button" class="btn small" id="plan-edit" data-act="pedit" style="margin-top:8px;align-self:flex-start">'+(ed?'Listo':'Personalizar')+'</button></section>';
  pl.forEach(function(d,i){
    out+='<section class="card"><div class="ex-head"><div class="day-title" style="flex-direction:row;align-items:center;flex:1;min-width:0"><span class="day-n" style="background:'+DAYC[i%DAYC.length]+'">'+(i+1)+'</span>'+
      (ed?'<input class="search" style="padding:8px 10px" id="dn-'+i+'" data-dn="'+i+'" maxlength="30" aria-label="Nombre del día '+(i+1)+'" value="'+esc(d.n)+'">':'<h3>'+esc(d.n)+'</h3>')+'</div>'+
      (!ed&&i===cur?'<span class="badge">Siguiente</span>':'')+
      (ed&&pl.length>1?'<button type="button" class="btn danger small" data-act="pdelday" data-i="'+i+'" aria-label="Quitar día '+(i+1)+'">Quitar día</button>':'')+'</div><ul class="day-list">'+
      d.e.map(function(id,j){
        var t=target(id);
        if(!ed) return '<li><span><i class="dot" style="background:'+mcol(id)+'"></i>'+esc(EX[id].n)+'</span><span class="muted num">'+t.sets+'×'+t.reps+'</span></li>';
        return '<li style="flex-direction:column;align-items:stretch;gap:8px"><span><i class="dot" style="background:'+mcol(id)+'"></i><b>'+esc(EX[id].n)+'</b></span>'+
          '<div class="rowb" style="flex-wrap:wrap">'+
          '<span class="small muted">Series</span><span class="stepper">'+
            '<button type="button" class="btn ghost small" data-act="pcfg" data-k="sets" data-d="-1" data-id="'+id+'" aria-label="Menos series">−</button><b class="num" style="min-width:26px;text-align:center">'+t.sets+'</b>'+
            '<button type="button" class="btn ghost small" data-act="pcfg" data-k="sets" data-d="1" data-id="'+id+'" aria-label="Más series">+</button></span>'+
          '<span class="small muted">Reps</span><span class="stepper">'+
            '<button type="button" class="btn ghost small" data-act="pcfg" data-k="reps" data-d="-1" data-id="'+id+'" aria-label="Menos repeticiones">−</button><b class="num" style="min-width:26px;text-align:center">'+t.reps+'</b>'+
            '<button type="button" class="btn ghost small" data-act="pcfg" data-k="reps" data-d="1" data-id="'+id+'" aria-label="Más repeticiones">+</button></span></div>'+
          '<div class="rowb"><span>'+
            '<button type="button" class="btn ghost small" data-act="pmove" data-i="'+i+'" data-j="'+j+'" data-d="-1" aria-label="Subir"'+(j===0?' disabled':'')+'>↑</button> '+
            '<button type="button" class="btn ghost small" data-act="pmove" data-i="'+i+'" data-j="'+j+'" data-d="1" aria-label="Bajar"'+(j===d.e.length-1?' disabled':'')+'>↓</button></span>'+
          '<button type="button" class="btn danger small" data-act="prem" data-i="'+i+'" data-j="'+j+'">Quitar</button></div></li>';
      }).join('')+'</ul>'+
      (ed?pickerHtml(i,d):
        (i===cur?'':'<button type="button" class="btn ghost" data-act="pick" data-i="'+i+'">Entrenar este día</button>'))+'</section>';
  });
  if(!ed) out+=tplHtml();
  if(ed){
    out+='<section class="card stack">'+(pl.length<7?'<button type="button" class="btn" data-act="paddday">Añadir día</button>':'')+
      (S.profile.custom||S.profile.cfg?'<button type="button" class="btn ghost" data-act="preset">Restaurar rutina automática</button>':'')+'</section>';
  }
  return out;
}

function norm(s){return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
var GROUPS=['Todos','Calistenia','Pecho','Espalda','Pierna','Hombro','Brazos','Abdomen'];

function libList(){
  var q=norm(libQ), n=0, out='';
  Object.keys(EX).forEach(function(id){
    var e=EX[id], inf=INFO[id];
    if(libG==='Calistenia'){if(!inf.cal) return}
    else if(libG!=='Todos'&&inf.g!==libG) return;
    if(q&&norm(e.n+' '+e.m+' '+inf.g+' '+inf.eq).indexOf(q)<0) return;
    n++;
    var col=mcol(id), open=openEx===id;
    out+='<article class="ex-card"><button type="button" id="ex-'+id+'" data-act="toggle-ex" data-id="'+id+'" aria-expanded="'+open+'">'+fig(id,col)+
      '<div class="ex-info"><div class="rowb"><h3>'+esc(e.n)+'</h3><span class="chip" style="--c:'+col+'">'+esc(inf.g)+'</span></div>'+
      '<p class="small muted"><i class="dot" style="background:var(--hl);margin-right:6px"></i>'+esc(e.m)+' · '+esc(inf.eq)+'</p></div></button>';
    if(open){
      var t=target(id);
      out+='<div class="ex-info" style="padding-top:0"><div class="facts">'+
        '<div><span class="label">Series × reps</span><b class="num">'+t.sets+' × '+t.reps+'</b></div>'+
        '<div><span class="label">Peso</span><b class="num">'+(e.bw?'Peso corporal':'Sugerido '+fmt(suggest(id),1)+' kg')+'</b></div>'+
        '<div><span class="label">Secundarios</span><b>'+esc(inf.sec)+'</b></div>'+
        '<div><span class="label">En tu rutina</span><b>'+(inPlan(id)?'Sí':'No')+'</b></div></div>'+
        '<span class="label">Cómo se hace</span><ol class="tips">'+inf.tips.map(function(t2){return '<li>'+esc(t2)+'</li>'}).join('')+'</ol></div>';
    }
    out+='</article>';
  });
  return n?out:'<p class="muted">No hay ejercicios que coincidan con la búsqueda.</p>';
}
function vLib(){
  var n=Object.keys(EX).length;
  return '<section class="hero"><span class="label">'+n+' ejercicios</span><h2>Ejercicios</h2><p>Cada ilustración muestra la posición inicial y la final. Toca una tarjeta para ver cómo se hace.</p></section>'+
    '<input id="lib-q" class="search" type="search" placeholder="Buscar ejercicio o músculo" value="'+esc(libQ)+'" data-lib="q" aria-label="Buscar ejercicio">'+
    '<div class="filters" role="group" aria-label="Grupo muscular">'+GROUPS.map(function(g){return '<button type="button" id="lg-'+g+'" data-act="lib-g" data-v="'+g+'" aria-pressed="'+(libG===g)+'">'+g+'</button>'}).join('')+'</div>'+
    '<div class="libgrid" id="lib-list">'+libList()+'</div>';
}

function overall(d){
  var lv=Object.keys(T).map(function(id){return rankOf(id,best(id,d.sessions),d.profile.bw).lv});
  return {lv:Math.floor(lv.reduce(function(a,b){return a+b},0)/lv.length),levels:lv};
}
function routineHtml(days,custom){
  return (custom&&custom.length?custom:plan(days)).map(function(d,i){
    return '<div class="pub"><div class="day-title"><span class="day-n" style="background:'+DAYC[i%DAYC.length]+'">'+(i+1)+'</span><b>'+esc(d.n)+'</b></div>'+
      '<p class="small muted">'+d.e.map(function(id){return esc(EX[id].n)}).join(' · ')+'</p></div>';
  }).join('');
}
function avInner(n,ph){
  if(ph&&/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/.test(ph)) return '<img src="'+ph+'" alt="">';
  return esc(String(n||'?').charAt(0).toUpperCase());
}
function photoFrom(file){
  return new Promise(function(res,rej){
    var fr=new FileReader(); fr.onerror=rej;
    fr.onload=function(){
      var img=new Image(); img.onerror=rej;
      img.onload=function(){
        var n=Math.min(img.width,img.height); if(!n){rej();return}
        var sx=(img.width-n)/2, sy=(img.height-n)/2, c=document.createElement('canvas'); c.width=c.height=256;
        var g=c.getContext('2d'); g.fillStyle='#fff'; g.fillRect(0,0,256,256); g.drawImage(img,sx,sy,n,n,0,0,256,256);
        res(c.toDataURL('image/jpeg',.82));
      };
      img.src=fr.result;
    };
    fr.readAsDataURL(file);
  });
}
document.addEventListener('change',function(e){
  if(!e.target||e.target.id!=='photo-in') return;
  var f=e.target.files&&e.target.files[0]; if(!f||!S) return;
  var er=document.getElementById('photo-err'); if(er) er.textContent='';
  if(f.size>20*1024*1024){if(er) er.textContent='La imagen es demasiado grande (máx. 20 MB).'; return}
  photoFrom(f).then(function(d){S.profile.photo=d; save(); render()}).catch(function(){var x=document.getElementById('photo-err'); if(x) x.textContent='No se pudo leer esa imagen. Prueba con otra (JPG o PNG).'});
});
var editName=false;
function nameEditor(p){
  if(!editName) return '<div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn" style="width:auto;padding:8px 16px;min-height:0" data-act="rename-open">Cambiar nombre</button>'+
    '<button type="button" class="btn" style="width:auto;padding:8px 16px;min-height:0" data-act="photo-pick">Cambiar foto</button>'+
    (p.photo?'<button type="button" class="btn ghost" style="width:auto;padding:8px 16px;min-height:0" data-act="photo-del">Quitar foto</button>':'')+
    '<input type="file" id="photo-in" accept="image/*" hidden></div><span class="small" id="photo-err" role="alert"></span>';
  return '<div class="field" style="margin-top:12px"><label class="label" for="f-name2">Nuevo nombre</label>'+
    '<input id="f-name2" type="text" maxlength="30" value="'+esc(p.name||'')+'" placeholder="Tu nombre" autocomplete="off">'+
    '<span class="small" id="name-err" role="alert"></span>'+
    '<div style="display:flex;gap:8px;margin-top:8px"><button type="button" class="btn" data-act="rename-save">Guardar</button>'+
    '<button type="button" class="btn ghost" data-act="rename-cancel">Cancelar</button></div></div>';
}
function renameSave(){
  var el=document.getElementById('f-name2'), v=el?el.value.replace(/\s+/g,' ').trim():'';
  if(!v){var e=document.getElementById('name-err'); if(e) e.textContent='Escribe un nombre.'; return}
  S.profile.name=v.slice(0,30); editName=false; save(); render();
}
document.addEventListener('keydown',function(e){
  if(!e.target||e.target.id!=='f-name2') return;
  if(e.key==='Enter'){e.preventDefault();renameSave()}
  else if(e.key==='Escape'){editName=false;render()}
});
function vPerfil(){
  var p=S.profile, u=DB.users[DB.session], ov=overall(S), pub=p.routine==='public';
  var total=S.sessions.reduce(function(a,s){return a+vol(s)},0);
  var out='<section class="hero"><div class="pro"><span class="avatar-lg" aria-hidden="true">'+avInner(p.name||u.email,p.photo)+'</span>'+
    '<div style="min-width:0"><h2>'+esc(p.name||'Mi cuenta')+'</h2><span class="label" style="overflow-wrap:anywhere;text-transform:none;letter-spacing:0">'+esc(u.email)+'</span></div></div>'+nameEditor(p)+
    '<div style="display:flex;gap:8px;flex-wrap:wrap">'+'<span class="rankpill">'+LEAGUES[leagueOf(ptsOf(S))].n+'</span>'+'</div></section>'+
    '<div class="stats"><div class="stat a"><span class="label">Sesiones</span><b class="num">'+S.sessions.length+'</b></div>'+
    '<div class="stat b"><span class="label">Volumen total</span><b class="num">'+fmt(total/1000,1)+' t</b></div></div>';

  out+='<section class="card stack"><div class="rowb"><h3>Mi rutina</h3><span class="state '+(pub?'pub-on':'pub-off')+'">'+(pub?'Pública':'Privada')+'</span></div>'+
    '<p class="small muted">'+p.days+' días por semana · '+GOALS[p.goal].n+'</p><div>'+routineHtml(p.days,p.custom)+'</div>'+
    '<div class="field"><span class="label">Quién puede ver mi rutina</span><div class="seg two" role="group" aria-label="Visibilidad de la rutina">'+
    '<button type="button" id="vis-private" data-act="vis" data-v="private" aria-pressed="'+(!pub)+'">Privada</button>'+
    '<button type="button" id="vis-public" data-act="vis" data-v="public" aria-pressed="'+pub+'">Pública</button></div>'+
    '<p class="small muted">'+(pub?'Las demás cuentas de este dispositivo ven tu rutina en Comunidad. Tu nombre y tu rango se muestran siempre.':'Solo tú ves tu rutina. Tu nombre y tu rango se muestran siempre en Comunidad.')+'</p></div></section>';

  out+='<section class="card"><h3>Mis rangos</h3><div style="margin-top:6px">'+Object.keys(T).map(function(id,i){
    return '<div class="mini"><span>'+esc(EX[id].n)+'</span><span class="rk" style="color:var(--r'+ov.levels[i]+')">'+RANKS[ov.levels[i]]+'</span></div>';
  }).join('')+'</div></section>';

  var others=Object.keys(DB.users).filter(function(k){return k!==DB.session});
  out+='<section class="card"><h3>Comunidad</h3><p class="small muted" style="margin:2px 0 6px">Cuentas de este dispositivo.</p>'+(others.length?others.map(function(k){
    var d=DB.users[k].data, o=overall(d), pr=d.profile.routine==='public';
    return '<div class="pub"><div class="rowb"><div class="day-title"><span class="avatar" aria-hidden="true">'+avInner(d.profile.name||k,d.profile.photo)+'</span><b>'+esc(d.profile.name||'Sin nombre')+'</b></div>'+
      '<span class="rk" style="color:var(--r'+o.lv+')">'+RANKS[o.lv]+'</span></div>'+
      (pr?'<span class="state pub-on" style="align-self:flex-start">Rutina pública</span>'+routineHtml(d.profile.days):'<span class="state pub-off" style="align-self:flex-start">Rutina privada</span>')+'</div>';
  }).join(''):'<p class="muted">Todavía no hay más cuentas. Cuando otra persona se registre aquí, verás su nombre y su rango, y su rutina si la hace pública.</p>')+'</section>';

  out+='<section class="card stack"><h3>Mis datos</h3>'+
    '<div class="field"><label class="label" for="f-name">Nombre</label><input id="f-name" type="text" value="'+esc(p.name)+'" placeholder="Tu nombre" data-f="name"></div>'+
    '<div class="field"><label class="label" for="f-bw">Peso corporal (kg)</label><input id="f-bw" type="text" inputmode="decimal" value="'+p.bw+'" data-f="bw"></div>'+
    '<div class="field"><span class="label">Días por semana</span><div class="seg">'+[3,4,5].map(function(d){return '<button type="button" id="d-'+d+'" data-act="days" data-v="'+d+'" aria-pressed="'+(p.days===d)+'">'+d+' días</button>'}).join('')+'</div></div>'+
    '<div class="field"><span class="label">Objetivo</span><div class="seg">'+Object.keys(GOALS).map(function(g){return '<button type="button" id="g-'+g+'" data-act="goal" data-v="'+g+'" aria-pressed="'+(p.goal===g)+'">'+GOALS[g].n+'</button>'}).join('')+'</div>'+
    '<p class="small muted">Fuerza: pocas repeticiones y más peso. Músculo: rango medio. Definición: más repeticiones.</p></div></section>'+
    '<section class="card stack"><h3>Descanso</h3><p class="small muted">Tiempo entre series. También puedes ajustarlo por ejercicio en Hoy.</p>'+
      [['main','Ejercicios principales'],['acc','Ejercicios de apoyo']].map(function(x){var rc=restCfg(); return '<div class="rowb"><span>'+x[1]+'</span><span class="stepper"><button type="button" class="btn ghost small" data-act="restcfg" data-k="'+x[0]+'" data-d="-15" aria-label="Menos tiempo">−</button><b class="num" style="min-width:44px;text-align:center">'+mmss(rc[x[0]])+'</b><button type="button" class="btn ghost small" data-act="restcfg" data-k="'+x[0]+'" data-d="15" aria-label="Más tiempo">+</button></span></div>'}).join('')+
      '<div class="seg two" role="group" aria-label="Avisos"><button type="button" id="rt-beep" data-act="resttog" data-k="beep" aria-pressed="'+restCfg().beep+'">Sonido</button><button type="button" id="rt-vib" data-act="resttog" data-k="vib" aria-pressed="'+restCfg().vib+'">Vibración</button></div></section>'+
    '<section class="card stack"><h3>Apariencia</h3>'+
      ('<span class="label">Color de la app · '+ACCS.filter(function(x){return x.id===(S.profile.acc||'violet')})[0].n+'</span><div class="swatches" role="group" aria-label="Color">'+ACCS.map(function(a){return '<button type="button" class="sw" id="acc-'+a.id+'" data-act="acc" data-v="'+a.id+'" aria-pressed="'+((S.profile.acc||'violet')===a.id)+'" aria-label="'+a.n+'" title="'+a.n+'" style="background:'+a.c+'"></button>'}).join('')+'</div>')+
      '<span class="label">Tema</span><div class="seg" role="group" aria-label="Tema">'+
      [['auto','Auto'],['light','Claro'],['dark','Oscuro']].map(function(t){return '<button type="button" id="th-'+t[0]+'" data-act="theme" data-v="'+t[0]+'" aria-pressed="'+(themePref()===t[0])+'">'+t[1]+'</button>'}).join('')+'</div></section>'+
    '<section class="card stack"><h3>Cuenta</h3><p class="small muted">Tus datos se guardan en este navegador y, si abres la app con tu sesión de Claude, también en la nube para usarlos en otros dispositivos.</p>'+
    '<button type="button" class="btn" id="logout" data-act="logout">Cerrar sesión</button>'+
    '<button type="button" class="btn ghost" data-act="reset">Borrar mis entrenamientos</button>'+
    '<button type="button" class="btn danger" id="delacc" data-act="delete">'+(confirmDel?'Pulsa otra vez para confirmar':'Eliminar mi cuenta')+'</button></section>';
  return out;
}





/* ---------- selector de ejercicios (Personalizar) ---------- */
var pick=null, PK_N=6;
function pkMatches(i){
  var day=getPlan()[i], q=norm(pick.q||'');
  return Object.keys(EX).filter(function(id){
    if(day.e.indexOf(id)>=0) return false;
    var inf=INFO[id]||{};
    if(pick.g==='Calistenia'){if(!inf.cal) return false} else if(pick.g!=='Todos'&&inf.g!==pick.g) return false;
    if(!q) return true;
    return norm(EX[id].n+' '+EX[id].m+' '+(inf.g||'')+' '+(inf.eq||'')+' '+(inf.sec||'')).indexOf(q)>=0;
  }).sort(function(a,b){
    var ra=q?(norm(EX[a].n).indexOf(q)>=0?0:norm(EX[a].m).indexOf(q)>=0?1:2):0, rb=q?(norm(EX[b].n).indexOf(q)>=0?0:norm(EX[b].m).indexOf(q)>=0?1:2):0;
    return ra-rb||EX[a].n.localeCompare(EX[b].n,'es');
  });
}
function pkList(){
  var m=pkMatches(pick.i), show=m.slice(0,pick.n);
  if(!m.length) return '<p class="small muted">No hay ejercicios que coincidan. Prueba con otra palabra, como «pecho», «mancuernas» o «glúteo».</p>';
  return '<p class="small muted" role="status">'+m.length+' ejercicio'+(m.length===1?'':'s')+'</p>'+show.map(function(id){
    var inf=INFO[id];
    return '<article class="pk-item">'+(POSES[id]?fig(id,''):'')+'<div class="rowb"><div style="min-width:0"><b>'+esc(EX[id].n)+'</b><p class="small muted">'+esc(EX[id].m)+(inf?' · '+esc(inf.eq):'')+'</p></div>'+
      '<button type="button" class="btn small" data-act="pkadd" data-id="'+id+'">Añadir</button></div></article>';
  }).join('')+(m.length>show.length?'<button type="button" class="btn ghost" data-act="pkmore">Ver más ('+(m.length-show.length)+')</button>':'');
}
function pickerHtml(i,d){
  if(!pick||pick.i!==i) return '<button type="button" class="btn" data-act="pkopen" data-i="'+i+'">+ Añadir ejercicio al día '+(i+1)+'</button>';
  return '<div class="picker"><div class="rowb"><h3>Añadir a «'+esc(d.n)+'»</h3><button type="button" class="btn ghost small" data-act="pkclose">Cerrar</button></div>'+
    '<input id="pk-q" class="search" type="search" data-pq="1" autocomplete="off" placeholder="Buscar: press, glúteo, mancuernas…" aria-label="Buscar ejercicio" value="'+esc(pick.q)+'">'+
    '<div class="filters" role="group" aria-label="Grupo muscular">'+GROUPS.map(function(g){return '<button type="button" data-act="pkg" data-g="'+g+'" aria-pressed="'+(pick.g===g)+'">'+g+'</button>'}).join('')+'</div>'+
    (pick.msg?'<p class="small" role="status" style="color:var(--ok);font-weight:600">✓ '+esc(pick.msg)+' añadido</p>':'')+
    '<div id="pk-list" class="stack">'+pkList()+'</div></div>';
}
function plates(kg){
  var per=(kg-20)/2, out=[], P=[25,20,15,10,5,2.5,1.25];
  if(per<=0) return null;
  P.forEach(function(p){while(per>=p-0.001){out.push(p);per-=p}});
  return out;
}
function recordsHtml(){
  var recs=Object.keys(EX).map(function(id){var b=bestSet(id,S.sessions);return b?{id:id,b:b}:null}).filter(Boolean).sort(function(a,b){return b.b.o-a.b.o}).slice(0,6);
  var wk=[],i,d0=mondayOf(new Date()),mx=1;
  for(i=5;i>=0;i--){var a=new Date(d0);a.setDate(a.getDate()-7*i);var z=new Date(a);z.setDate(z.getDate()+7);
    var v=S.sessions.filter(function(x){var t=new Date(x.date);return t>=a&&t<z}).reduce(function(q,x){return q+vol(x)},0);
    wk.push({l:a.toLocaleDateString('es-ES',{day:'numeric',month:'short'}),v:v});mx=Math.max(mx,v)}
  var out='<section class="card stack"><h3>Volumen por semana</h3><div class="wkbars" role="img" aria-label="Volumen de las últimas 6 semanas">'+wk.map(function(w){
    return '<div class="wkc"><span class="small num">'+(w.v?fmt(w.v/1000,1):'')+'</span><i style="height:'+Math.max(4,Math.round(100*w.v/mx))+'%"></i><span class="small muted">'+w.l+'</span></div>'}).join('')+'</div><p class="small muted">Toneladas levantadas por semana.</p></section>';
  out+='<section class="card stack"><h3>Récords personales</h3>'+(recs.length?'<ul class="hist">'+recs.map(function(r){
    return '<li><span><b>'+esc(EX[r.id].n)+'</b><br><span class="small muted">'+esc(new Date(r.b.date).toLocaleDateString('es-ES',{day:'numeric',month:'short'}))+'</span></span><span class="num"><b>'+fmt(r.b.kg,1)+' kg</b> × '+r.b.reps+'</span></li>'}).join('')+'</ul>':'<p class="small muted">Aún no hay récords. Registra tu primera sesión.</p>')+'</section>';
  return out;
}

/* ---------- ranking Forja (puntos y ligas) ---------- */
var LEAGUES=[
  {n:'Novato',min:0,c1:'#9AA0B4',c2:'#5F657D',d:'Tu viaje acaba de empezar.'},
  {n:'Aprendiz',min:300,c1:'#43C78A',c2:'#12875A',d:'Ya le has cogido el gusto a la rutina.'},
  {n:'Constante',min:800,c1:'#2CC8D0',c2:'#0A7D96',d:'Entrenas semana tras semana.'},
  {n:'Atleta',min:1800,c1:'#5C94FF',c2:'#2650D8',d:'Tu cuerpo ya lo nota.'},
  {n:'Guerrero',min:3500,c1:'#A06BFF',c2:'#5B2EC8',d:'Nadie te para en el gimnasio.'},
  {n:'Élite',min:6000,c1:'#FF6B8A',c2:'#C2184A',d:'Estás entre los más fuertes.'},
  {n:'Maestro',min:10000,c1:'#FFC24A',c2:'#E07A00',d:'Dominas el arte del hierro.'},
  {n:'Leyenda',min:16000,c1:'#FFF0A8',c2:'#F2A20C',d:'Una leyenda de la Forja.'}
];
function leagueOf(p){var i=0,k;for(k=0;k<LEAGUES.length;k++) if(p>=LEAGUES[k].min) i=k;return i}
function ptsOf(d){
  var real=d.sessions.filter(function(x){return !x.example}), top={}, pts=0, weeks={};
  real.forEach(function(x){
    var sets=x.ex.reduce(function(a,e){return a+e.sets.length},0);
    pts+=100+sets*8+Math.min(100,Math.round(vol(x)/100));
    weeks[mondayOf(new Date(x.date)).getTime()]=1;
    x.ex.forEach(function(e){
      var t=e.sets.reduce(function(a,y){return Math.max(a,orm(y.kg,y.reps))},0);
      if(top[e.id]!=null&&t>top[e.id]+.01) pts+=40;
      if(top[e.id]==null||t>top[e.id]) top[e.id]=t;
    });
  });
  pts+=Object.keys(weeks).length*20;
  var lv=overall({sessions:real,profile:d.profile}).levels.reduce(function(a,b){return a+b},0);
  return pts+lv*120;
}
var badgeN=0;
function star(cx,cy,R,r,n){var o=[],i;for(i=0;i<n*2;i++){var a=-Math.PI/2+i*Math.PI/n,q=i%2?r:R;o.push(n1(cx+Math.cos(a)*q)+','+n1(cy+Math.sin(a)*q))}return o.join(' ')}
function emblem(i){
  var w='fill="#fff" stroke="rgba(0,0,0,.25)" stroke-width="1.2" stroke-linejoin="round"';
  switch(i){
    case 0: return '<g '+w+'><rect x="40" y="46" width="20" height="8" rx="2"/><rect x="28" y="38" width="12" height="24" rx="3"/><rect x="60" y="38" width="12" height="24" rx="3"/></g>';
    case 1: return '<g '+w+'><polygon points="30,60 50,40 70,60 62,66 50,54 38,66"/><polygon points="30,80 50,60 70,80 62,86 50,74 38,86"/></g>';
    case 2: return '<path '+w+' d="M50 30 C58 46 70 50 66 68 C64 78 57 84 50 84 C43 84 36 78 34 68 C32 58 41 54 43 44 C46 48 48 50 50 53 C53 46 51 38 50 30Z"/>';
    case 3: return '<polygon '+w+' points="56,28 34,60 48,60 42,90 68,52 53,52"/>';
    case 4: return '<polygon '+w+' points="'+star(50,60,28,12,5)+'"/>';
    case 5: return '<g '+w+'><polygon points="30,78 28,46 41,60 50,40 59,60 72,46 70,78"/><rect x="30" y="78" width="40" height="7" rx="2"/></g>';
    case 6: return '<g '+w+'><polygon points="50,34 74,56 50,88 26,56"/><polyline points="26,56 74,56 M38,56 50,34 62,56 50,88 38,56" fill="none" stroke="rgba(0,0,0,.3)"/></g>';
    default: return '<g '+w+'><polygon points="'+star(50,60,32,15,8)+'"/><circle cx="50" cy="60" r="9" fill="rgba(0,0,0,.18)" stroke="none"/></g>';
  }
}
function badge(i,sz,locked){
  var L=LEAGUES[i], id='bg'+(badgeN++);
  return '<svg class="badge-svg'+(locked?' locked':'')+'" viewBox="0 0 100 120" width="'+sz+'" height="'+(sz*1.2)+'" role="img" aria-label="Insignia '+L.n+'">'+
    '<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+L.c1+'"/><stop offset="1" stop-color="'+L.c2+'"/></linearGradient></defs>'+
    '<path d="M50 4 L92 18 V60 C92 88 72 108 50 116 C28 108 8 88 8 60 V18 Z" fill="url(#'+id+')" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>'+
    '<path d="M50 11 L85 23 V60 C85 83 68 100 50 108 C32 100 15 83 15 60 V23 Z" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2"/>'+
    '<path d="M50 4 L92 18 V40 C70 46 30 46 8 40 V18 Z" fill="rgba(255,255,255,.2)"/>'+emblem(i)+'</svg>';
}
function leaderboard(){
  var rows=Object.keys(DB.users).map(function(e){
    var d=DB.users[e].data, p=ptsOf(d);
    return {email:e,name:(d.profile.name||e),pts:p,lg:leagueOf(p),me:e===DB.session};
  }).sort(function(a,b){return b.pts-a.pts});
  return rows;
}
function vRanking(){
  var p=ptsOf(S), i=leagueOf(p), L=LEAGUES[i], nx=LEAGUES[i+1];
  var pct=nx?Math.round(100*(p-L.min)/(nx.min-L.min)):100;
  var out='<section class="hero rk" style="background:linear-gradient(135deg,'+L.c2+','+L.c1+')"><span class="label">Tu rango Forja</span>'+
    '<div class="rk-top">'+badge(i,92,false)+'<div><h2>'+L.n+'</h2><p><b class="num">'+fmt(p)+'</b> puntos</p><p class="small">'+esc(L.d)+'</p></div></div>'+
    '<div class="meter rk-m" aria-hidden="true"><i style="width:'+pct+'%;background:#fff"></i></div>'+
    '<p class="small">'+(nx?'Te faltan <b class="num">'+fmt(nx.min-p)+'</b> puntos para <b>'+nx.n+'</b>.':'¡Has alcanzado el rango máximo!')+'</p></section>';
  var rows=leaderboard();
  out+='<section class="card stack"><h3>Clasificación</h3>'+(rows.length>1?'<ul class="hist">'+rows.map(function(r,k){
    return '<li'+(r.me?' class="me"':'')+'><span class="lbrow"><b class="num lbpos">'+(k+1)+'</b>'+badge(r.lg,30,false)+'<span style="min-width:0"><b>'+esc(r.name)+(r.me?' · tú':'')+'</b><br><span class="small muted">'+LEAGUES[r.lg].n+'</span></span></span><b class="num">'+fmt(r.pts)+'</b></li>';
  }).join('')+'</ul>':'<p class="small muted">Aquí aparecerán todas las cuentas de este dispositivo para que compitáis. Ahora solo estás tú.</p>')+'</section>';
  out+=recordsHtml();
  out+='<section class="card stack"><h3>Cómo ganar puntos</h3><ul class="perks">'+
    [['💪','Cada sesión terminada','100 puntos más 8 por serie y hasta 100 por volumen.'],['🏆','Récord personal','+40 puntos cada vez que superas tu mejor marca en un ejercicio.'],['📅','Semanas activas','+20 puntos por cada semana en la que entrenas.'],['🎖️','Rangos de fuerza','+120 puntos por cada nivel de Hierro a Diamante en tus 5 levantamientos.']].map(function(x){
      return '<li><span class="pi" aria-hidden="true">'+x[0]+'</span><span><b>'+x[1]+'</b><br><span class="small muted">'+x[2]+'</span></span></li>'}).join('')+'</ul></section>';
  out+='<div class="head" style="margin:6px 0 -4px"><h3>Todas las insignias</h3><p class="small muted">Desbloquea una por cada rango.</p></div><div class="badges">'+LEAGUES.map(function(l,k){
    var got=k<=i;
    return '<div class="bcell'+(k===i?' cur':'')+'">'+badge(k,64,!got)+'<b>'+l.n+'</b><span class="small muted num">'+(got?(k===i?'Tu rango':'Conseguida'):fmt(l.min)+' pts')+'</span></div>';
  }).join('')+'</div>';
  return out;
}

/* ---------- Plantillas y colores ---------- */
var TPL=[
  {id:'cal3',n:'Calistenia 3 días',d:'Empuje, tirón y piernas con tu peso corporal.',days:[
    {n:'Empuje',e:['pushup','declinepush','pikepush','dips','benchdip']},
    {n:'Tirón',e:['pullup','chinup','invrow','scapular','hangknee']},
    {n:'Piernas y core',e:['bwsquat','bwlunge','singlebridge','bwcalf','hollow','plank']}]},
  {id:'cal4',n:'Calistenia 4 días',d:'Más volumen y un día dedicado al core.',days:[
    {n:'Empuje',e:['pushup','diamondpush','declinepush','pikepush','dips']},
    {n:'Tirón',e:['pullup','widepullup','invrow','chinup','hang']},
    {n:'Piernas',e:['bwsquat','pistol','bwlunge','singlebridge','nordic','bwcalf']},
    {n:'Core',e:['hollow','vup','mountain','lsit','superman','birddog']}]},
  {id:'str3',n:'Fuerza 5×5',d:'Tres días de levantamientos básicos con 5 series de 5.',cfg:{squat:[5,5],bench:[5,5],row:[5,5],deadlift:[5,5],ohp:[5,5]},days:[
    {n:'Fuerza A',e:['squat','bench','row']},
    {n:'Fuerza B',e:['deadlift','ohp','pulldown']},
    {n:'Fuerza C',e:['squat','incline','row']}]},
  {id:'ppl6',n:'Empuje / Tirón / Pierna ×2',d:'Seis días para ganar músculo con mucho volumen.',days:[
    {n:'Empuje A',e:['bench','ohp','incline','lateral','pushdown']},
    {n:'Tirón A',e:['row','pulldown','face','curl']},
    {n:'Pierna A',e:['squat','rdl','legpress','legcurl','calf']},
    {n:'Empuje B',e:['incline','ohp','lateral','pushdown']},
    {n:'Tirón B',e:['pulldown','row','face','curl']},
    {n:'Pierna B',e:['deadlift','legpress','thrust','calf']}]}
];
var ACCS=[
  {id:'violet',n:'Violeta',c:'linear-gradient(135deg,#4326D6,#9A26C2)'},
  {id:'fire',n:'Fuego',c:'linear-gradient(135deg,#E8590C,#D6264A)'},
  {id:'ocean',n:'Océano',c:'linear-gradient(135deg,#0A5FA0,#0AA0A0)'},
  {id:'forest',n:'Bosque',c:'linear-gradient(135deg,#0A7A4E,#58A800)'},
  {id:'rose',n:'Rosa',c:'linear-gradient(135deg,#D6246E,#FF7AA8)'},
  {id:'gold',n:'Dorado',c:'linear-gradient(135deg,#8A5A00,#E0A100)'},
  {id:'sunset',n:'Atardecer',c:'linear-gradient(135deg,#FF512F,#F09819)'},
  {id:'mint',n:'Menta',c:'linear-gradient(135deg,#00846E,#2BC48A)'},
  {id:'graphite',n:'Grafito',c:'linear-gradient(135deg,#2D3142,#6B7089)'},
  {id:'cherry',n:'Cereza',c:'linear-gradient(135deg,#9B1B30,#E8316A)'},
  {id:'sky',n:'Cielo',c:'linear-gradient(135deg,#1E6FE5,#4FB8F5)'},
  {id:'lime',n:'Lima',c:'linear-gradient(135deg,#3F7D00,#8CBF1F)'}
];
function applyAcc(){var a=(S&&S.profile.acc)||'violet'; var r=document.documentElement; if(a==='violet') r.removeAttribute('data-acc'); else r.setAttribute('data-acc',a)}
function tplHtml(){
  var out='<section class="card stack"><h3>Plantillas de rutina</h3><p class="small muted">Rutinas completas listas para usar. Al aplicar una plantilla se sustituye tu rutina actual.</p>';
  return out+TPL.map(function(t){
    return '<div class="pub"><div class="rowb"><div style="min-width:0"><b>'+esc(t.n)+'</b><p class="small muted">'+esc(t.d)+' · '+t.days.length+' días</p></div><button type="button" class="btn small" id="tpl-'+t.id+'" data-act="tpl" data-id="'+t.id+'">Aplicar</button></div></div>';
  }).join('')+'</section>';
}
var cloudDb=null, cloudUid=null;
/* ---------- Comida: foto → productos y calorías ---------- */
var food={busy:'',err:''};
var FPROMPT='Eres nutricionista. Analiza la foto de comida adjunta.\n'+
'1) Identifica ABSOLUTAMENTE TODOS los productos visibles, cada uno por separado: cada alimento, guarnición, salsa, pan, bebida, postre, fruta, aceite o aderezo visible y, si se ven, envases o marcas.\n'+
'2) Para cada producto estima la cantidad que se ve (gramos o ml) y sus calorías y macronutrientes para esa cantidad.\n'+
'3) Responde SOLO con JSON válido, sin texto extra, con esta forma exacta:\n'+
'{"plato":"nombre corto de la comida","productos":[{"nombre":"","cantidad":"150 g","gramos":150,"kcal":0,"proteina":0,"carbohidratos":0,"grasas":0}],"confianza":"alta|media|baja","nota":"supuestos importantes o aviso"}\n'+
'Todo en español. Si la imagen no contiene comida, devuelve "productos":[] y explícalo en "nota". No calcules totales.';
var FERR={unavailable:'El análisis con IA solo funciona al abrir la app desde Claude y permitir el uso de Claude con imágenes. La foto ya está archivada: podrás analizarla más tarde.',not_granted:'No has permitido que la app use Claude. La foto está archivada: pulsa Reintentar cuando quieras analizarla.',images_unavailable:'Este visor no permite enviar imágenes a Claude. La foto está archivada.',rate_limited:'Demasiadas peticiones seguidas. Espera un momento y pulsa Reintentar.'};
function meals(){return S.profile.meals||(S.profile.meals=[])}
function photoKey(){return 'forja-fotos-'+(DB.session||'x')}
function photos(){try{return JSON.parse(localStorage.getItem(photoKey())||'{}')||{}}catch(e){return {}}}
function putPhoto(id,url){
  var m=photos(), ks;
  if(url===null) delete m[id]; else m[id]=url;
  for(;;){
    try{localStorage.setItem(photoKey(),JSON.stringify(m));return true}
    catch(e){ks=Object.keys(m).sort(); if(ks.length<=1||ks[0]===id&&ks.length<2) return false; delete m[ks[0]===id?ks[1]:ks[0]]}
  }
}
function shrink(file,max,q){
  return new Promise(function(res,rej){
    var u=URL.createObjectURL(file), im=new Image();
    im.onload=function(){
      var s=Math.min(1,max/Math.max(im.width,im.height)), c=document.createElement('canvas');
      c.width=Math.max(1,Math.round(im.width*s)); c.height=Math.max(1,Math.round(im.height*s));
      c.getContext('2d').drawImage(im,0,0,c.width,c.height); URL.revokeObjectURL(u);
      c.toBlob(function(b){b?res({blob:b,url:c.toDataURL('image/jpeg',q)}):rej()},'image/jpeg',q);
    };
    im.onerror=function(){rej()}; im.src=u;
  });
}
function fnum(v){v=parseFloat(v);return isFinite(v)&&v>0?Math.round(v*10)/10:0}
function normItems(r){
  var a=(r&&r.productos)||[];
  if(!Array.isArray(a)) a=[];
  return a.slice(0,40).map(function(x){return {n:String(x.nombre||'Producto').slice(0,60),q:String(x.cantidad||'').slice(0,24),g:fnum(x.gramos),k:Math.round(fnum(x.kcal)),p:fnum(x.proteina),c:fnum(x.carbohidratos),f:fnum(x.grasas)}});
}
function mt(m){var t={k:0,p:0,c:0,f:0};(m.items||[]).forEach(function(x){t.k+=x.k;t.p+=x.p;t.c+=x.c;t.f+=x.f});t.p=Math.round(t.p);t.c=Math.round(t.c);t.f=Math.round(t.f);return t}
function dayKey(ts){var d=new Date(ts);return d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()}
function dayLabel(ts){
  var k=dayKey(ts); if(k===dayKey(Date.now())) return 'Hoy'; if(k===dayKey(Date.now()-864e5)) return 'Ayer';
  var s=new Date(ts).toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'}); return s.charAt(0).toUpperCase()+s.slice(1);
}
function foodAnalyze(id,blob){
  var m=meals().filter(function(x){return x.id===id})[0], cl=window.claude;
  if(!m) return;
  food.busy=id; food.err=''; render();
  (cl&&cl.use?cl.use('sample'):Promise.resolve(null)).then(function(sm){
    if(!sm) throw {code:'unavailable'};
    return Promise.resolve(sm.limits?sm.limits():null).then(function(l){
      if(l&&l.images===false) throw {code:'images_unavailable'};
      return sm.json(FPROMPT,{images:[blob],modelTier:'default',cache:false});
    });
  }).then(function(r){
    m.items=normItems(r); m.name=String((r&&r.plato)||'Comida').slice(0,60); m.conf=String((r&&r.confianza)||'').slice(0,10); m.note=String((r&&r.nota)||'').slice(0,260);
    m.st=m.items.length?'ok':'vacia';
  }).catch(function(e){
    m.st='error'; food.err=FERR[e&&e.code]||'No se pudo analizar la foto. Pulsa Reintentar.';
  }).then(function(){food.busy='';save();render()});
}
function foodRetry(id){
  var ph=photos()[id];
  if(!ph){food.err='No tengo la foto guardada en este dispositivo.';render();return}
  fetch(ph).then(function(r){return r.blob()}).then(function(b){foodAnalyze(id,b)}).catch(function(){food.err='No se pudo leer la foto guardada.';render()});
}
function vFood(){
  var all=meals(), today=dayKey(Date.now()), goal=S.profile.kcalGoal||2200, T={k:0,p:0,c:0,f:0}, PH=photos(), last='', out='';
  all.forEach(function(m){if(dayKey(m.ts)===today){var t=mt(m);T.k+=t.k;T.p+=t.p;T.c+=t.c;T.f+=t.f}});
  out+='<section class="hero"><span class="label">Calorías de hoy</span><div class="vip-price" style="color:inherit"><b class="num" style="font-family:var(--font-display);font-size:3rem;line-height:1">'+T.k+'</b><span>de '+goal+' kcal</span></div>'+
    '<div class="meter" role="progressbar" aria-valuemin="0" aria-valuemax="'+goal+'" aria-valuenow="'+T.k+'"><i style="width:'+Math.min(100,Math.round(100*T.k/goal))+'%"></i></div>'+
    '<div style="display:flex;gap:8px;flex-wrap:wrap"><span class="rankpill">Proteína '+T.p+' g</span><span class="rankpill">Carbohidratos '+T.c+' g</span><span class="rankpill">Grasas '+T.f+' g</span></div></section>';
  out+='<section class="card stack"><h3>Analiza tu comida</h3><p class="small muted">Haz una foto al plato y te digo cada producto, su cantidad y sus calorías. Cada foto queda archivada abajo.</p>'+
    '<div class="seg two"><label class="btn" for="food-cam" id="food-cam-l" style="text-align:center">📷 Hacer foto</label><label class="btn ghost" for="food-gal" style="text-align:center">🖼️ Galería</label></div>'+
    '<input class="sr" id="food-cam" type="file" accept="image/*" capture="environment" data-food="1"><input class="sr" id="food-gal" type="file" accept="image/*" data-food="1">'+
    (food.busy?'<p class="small" role="status"><span class="spin" aria-hidden="true"></span> Analizando la foto producto por producto…</p>':'')+
    (food.err?'<p class="small" role="alert" style="color:var(--hot)">'+esc(food.err)+'</p>':'')+
    '<div class="rowb"><span class="small muted">Meta diaria</span><span class="stepper"><button type="button" class="btn ghost small" data-act="fgoal" data-d="-100" aria-label="Bajar meta">−</button><b class="num" style="min-width:64px;text-align:center">'+goal+'</b><button type="button" class="btn ghost small" data-act="fgoal" data-d="100" aria-label="Subir meta">+</button></span></div></section>';
  if(!all.length) out+='<section class="card"><p class="muted">Aún no has archivado ninguna comida. Tu primera foto aparecerá aquí con el desglose por productos.</p></section>';
  all.forEach(function(m){
    var dk=dayKey(m.ts), t=mt(m), time=new Date(m.ts).toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});
    if(dk!==last){
      var dt={k:0}; all.forEach(function(x){if(dayKey(x.ts)===dk) dt.k+=mt(x).k});
      out+='<h3 class="daylbl">'+dayLabel(m.ts)+' · '+dt.k+' kcal</h3>'; last=dk;
    }
    out+='<article class="card stack meal">'+
      '<div class="mrow">'+(PH[m.id]?'<img class="mph" src="'+PH[m.id]+'" alt="Foto de '+esc(m.name||'comida')+'">':'<div class="mph ph" aria-hidden="true">🍽️</div>')+
      '<div style="min-width:0;flex:1"><b>'+esc(m.name||'Comida')+'</b><p class="small muted">'+time+(m.conf?' · confianza '+esc(m.conf):'')+'</p>'+
      '<p class="num" style="font-family:var(--font-display);font-size:1.6rem;line-height:1.1">'+t.k+' <span class="small muted" style="font-family:var(--font-body)">kcal</span></p>'+
      '<p class="small muted">P '+t.p+' g · C '+t.c+' g · G '+t.f+' g</p></div></div>';
    if(food.busy===m.id) out+='<p class="small" role="status"><span class="spin" aria-hidden="true"></span> Analizando…</p>';
    else if(m.st==='error'||m.st==='pend') out+='<button type="button" class="btn small" data-act="fretry" data-id="'+m.id+'">Reintentar análisis</button>';
    else if(m.st==='vacia') out+='<p class="small muted">No he detectado comida en esta foto.'+(m.note?' '+esc(m.note):'')+'</p><button type="button" class="btn ghost small" data-act="fretry" data-id="'+m.id+'">Reintentar</button>';
    if(m.items&&m.items.length){
      out+='<div class="fitems" role="list" aria-label="Productos de la foto">'+m.items.map(function(x,j){
        return '<div class="fi" role="listitem"><div style="min-width:0"><b>'+esc(x.n)+'</b><p class="small muted">'+esc(x.q||(x.g?x.g+' g':''))+(x.p||x.c||x.f?' · P '+x.p+' · C '+x.c+' · G '+x.f:'')+'</p></div>'+
          '<b class="num">'+x.k+' kcal</b><button type="button" class="btn ghost small" data-act="fitemdel" data-id="'+m.id+'" data-j="'+j+'" aria-label="Quitar '+esc(x.n)+'">✕</button></div>';
      }).join('')+'</div>';
      if(m.note) out+='<p class="small muted">'+esc(m.note)+'</p>';
    }
    out+='<button type="button" class="btn ghost small" data-act="fdel" data-id="'+m.id+'">Eliminar esta comida</button></article>';
  });
  out+='<p class="small muted" style="margin-top:6px">Valores aproximados estimados por IA a partir de la foto. No sustituyen el consejo de un nutricionista.</p>';
  return out;
}
document.addEventListener('change',function(e){
  var t=e.target, f;
  if(!t||!t.dataset||!t.dataset.food||!S) return;
  f=t.files&&t.files[0]; t.value=''; if(!f) return;
  food.err='';
  Promise.all([shrink(f,1024,.82),shrink(f,640,.7)]).then(function(r){
    var id='m'+Date.now();
    meals().unshift({id:id,ts:Date.now(),name:'Comida',items:[],st:'pend'});
    if(meals().length>400) meals().length=400;
    putPhoto(id,r[1].url); save(); foodAnalyze(id,r[0].blob);
  }).catch(function(){food.err='No se pudo leer la foto.';render()});
});

var VIEWS={comida:vFood,hoy:vHoy,plan:vPlan,ejercicios:vLib,ranking:vRanking,perfil:vPerfil};
function themePref(){try{return localStorage.getItem('forja-tema')||'auto'}catch(e){return 'auto'}}
function applyTheme(v){
  var r=document.documentElement; if(v==='light'||v==='dark') r.setAttribute('data-theme',v); else r.removeAttribute('data-theme');
}
applyTheme(themePref());
function moveLens(){
  var l=document.getElementById('lens'), a=document.querySelector('nav.bar button[aria-current="page"]');
  if(l&&!a){l.style.opacity='0';return}
  if(!l||!a||!a.offsetWidth) return;
  l.style.opacity='';
  var x='translateX('+a.offsetLeft+'px)';
  l.style.setProperty('--lx',x); l.style.transform=x; l.style.width=a.offsetWidth+'px';
}
window.addEventListener('resize',moveLens);
['pointerdown','pointerup','pointercancel','pointerleave'].forEach(function(ev){
  document.addEventListener(ev,function(e){var l=document.getElementById('lens'); if(!l||!e.target.closest) return; if(ev==='pointerdown'){if(e.target.closest('nav.bar button')) l.classList.add('press')}else l.classList.remove('press')},true);
});
function render(){
  var logged=!!S;
  $('#nav').hidden=!logged;
  $('#who').innerHTML=logged?'<button type="button" class="whobtn" data-tab="perfil" aria-label="Abrir mi perfil"'+(tab==='perfil'?' aria-current="page"':'')+'><span>'+esc(S.profile.name||'Mi cuenta')+'</span><span class="avatar" aria-hidden="true">'+avInner(S.profile.name||DB.session||'?',S.profile.photo)+'</span></button>':'';
  $('#view').innerHTML=logged?VIEWS[tab]():vAuth();
  document.querySelectorAll('nav.bar button').forEach(function(b){
    if(b.dataset.tab===tab) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current');
  });
  moveLens();
}

/* ---------- descanso ---------- */
function mmss(s){return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function restUpdate(){
  if(!rest) return;
  var left=Math.max(0,Math.ceil((rest.end-Date.now())/1000));
  $('#restTxt').textContent=left?mmss(left):'¡Listo!';
  if(!left&&!rest.done){rest.done=true;ping()}
  $('#restBar').style.width=Math.min(100,100*left/rest.total)+'%';
}
function restCfg(){var r=S.profile.rest||{}; return {main:r.main||120,acc:r.acc||90,beep:r.beep!==false,vib:r.vib!==false}}
function restFor(id){var o=S.profile.restEx&&S.profile.restEx[id]; if(o) return o; var c=restCfg(); return EX[id].main?c.main:c.acc}
function restSet(k,d){var r=S.profile.rest=S.profile.rest||{}; var c=restCfg(); r[k]=Math.max(15,Math.min(600,c[k]+d)); r.beep=c.beep; r.vib=c.vib}
function ping(){
  var c=restCfg();
  if(c.vib){try{navigator.vibrate&&navigator.vibrate([200,100,200])}catch(e){}}
  if(c.beep){try{
    var A=window.AudioContext||window.webkitAudioContext, ac=new A(), t=ac.currentTime;
    [0,.25].forEach(function(o){var os=ac.createOscillator(),g=ac.createGain();os.frequency.value=o?988:784;os.connect(g);g.connect(ac.destination);
      g.gain.setValueAtTime(.0001,t+o);g.gain.exponentialRampToValueAtTime(.35,t+o+.02);g.gain.exponentialRampToValueAtTime(.0001,t+o+.22);os.start(t+o);os.stop(t+o+.24)});
    setTimeout(function(){try{ac.close()}catch(e){}},900);
  }catch(e){}}
}
function restStart(sec){
  rest={end:Date.now()+sec*1000,total:sec};
  $('#rest').hidden=false; restUpdate(); clearInterval(tick); tick=setInterval(restUpdate,300);
}
function restStop(){rest=null;clearInterval(tick);$('#rest').hidden=true}

/* ---------- acciones ---------- */
function authError(t){var e=$('#err'); if(e) e.textContent=t}
function withTimeout(p,ms){return Promise.race([p,new Promise(function(r){setTimeout(r,ms)})])}
var authBusy=false;
function authSubmit(){
  if(authBusy) return;
  var d=draft;
  [['name','a-name'],['email','a-email'],['pass','a-pass'],['bw','a-bw']].forEach(function(p){var el=document.getElementById(p[1]); if(el) d[p[0]]=el.value});
  var email=String(d.email).trim().toLowerCase();
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){authError('Escribe un correo válido.');return}
  if(String(d.pass).length<6){authError('La contraseña necesita al menos 6 caracteres.');return}
  if(SUPA){sbAuth(email,d);return}
  authBusy=true; setTimeout(function(){authBusy=false},4000);
  authError('Creando cuenta…');
  if(mode==='signup'){
    var name=String(d.name).trim(), bw=parseFloat(String(d.bw).replace(',','.'));
    if(!name){authError('Escribe tu nombre.');return}
    if(!(bw>30&&bw<250)){authError('Indica un peso corporal entre 30 y 250 kg.');return}
    if(DB.users[email]){authError('Ya existe una cuenta con ese correo. Pulsa Entrar.');return}
    var salt=randSalt();
    withTimeout(cloudReady.then(function(){return cloudPull()}),2500).catch(function(){}).then(function(){ if(DB.users[email]){authError('Ya existe una cuenta con ese correo. Pulsa Entrar.');return}
    return hash(salt,d.pass).then(function(h){
      DB.users[email]={email:email,salt:salt,hash:h,created:Date.now(),data:fresh({name:name.slice(0,30),bw:bw,days:d.days,goal:d.goal,routine:'private'})};
      enter(email);
    });
    }).catch(function(err){authError('No se pudo crear la cuenta: '+(err&&err.message?err.message:'error desconocido'))});
  }else{
    var go=function(){
      var u=DB.users[email];
      if(!u){authError('Correo o contraseña incorrectos.');return}
      hash(u.salt,d.pass).then(function(h){
        if(h!==u.hash){authError('Correo o contraseña incorrectos.');return}
        enter(email);
      }).catch(function(){authError('No se pudo entrar. Inténtalo de nuevo.')});
    };
    if(DB.users[email]) go(); else {authError('Buscando tu cuenta…'); withTimeout(cloudReady.then(function(){return cloudPull()}),2500).catch(function(){}).then(go)}
  }
}
function finish(){
  var c=S.cur, ex=[];
  c.rows.forEach(function(r){
    var sets=r.sets.filter(function(s){return s.done&&s.kg>0&&s.reps>0}).map(function(s){return {kg:s.kg,reps:s.reps}});
    if(sets.length) ex.push({id:r.id,sets:sets});
  });
  if(!ex.length){$('#msg').textContent='Marca al menos una serie como hecha para guardar la sesión.';return}
  var before={};
  Object.keys(T).forEach(function(id){before[id]=rankOf(id,best(id,S.sessions),S.profile.bw).lv});
  var ptsB=ptsOf(S);
  var ses={date:new Date().toISOString(),name:c.name,ex:ex};
  var prs=[];
  ex.forEach(function(e){
    var prev=bestSet(e.id,S.sessions); if(!prev) return;
    var top=e.sets.reduce(function(a,x){return orm(x.kg,x.reps)>orm(a.kg,a.reps)?x:a});
    if(orm(top.kg,top.reps)>prev.o+0.01) prs.push({ex:EX[e.id].n,kg:top.kg,reps:top.reps});
  });
  S.sessions.push(ses);
  var ups=[];
  Object.keys(T).forEach(function(id){
    var lv=rankOf(id,best(id,S.sessions),S.profile.bw).lv;
    if(lv>before[id]) ups.push({ex:EX[id].n,rank:RANKS[lv]});
  });
  var ptsA=ptsOf(S), lgB=leagueOf(ptsB), lgA=leagueOf(ptsA);
  S.summary={name:c.name,vol:vol(ses),sets:ex.reduce(function(a,e){return a+e.sets.length},0),ups:ups,prs:prs,pts:ptsA-ptsB,lg:lgA>lgB?lgA:-1};
  S.dayIdx=(c.dayIdx+1)%getPlan().length; S.cur=null; restStop(); save(); render(); window.scrollTo(0,0);
}
document.addEventListener('click',function(e){
  var b=e.target.closest&&e.target.closest('#a-go'); if(b){e.preventDefault(); authSubmit()}
});
window.addEventListener('error',function(e){var el=document.getElementById('err'); if(el&&!/ResizeObserver/.test(e.message||'')) el.textContent='Error: '+(e.message||'desconocido')});
document.addEventListener('submit',function(e){
  e.preventDefault();
  if(e.target.id==='authForm') authSubmit();
});
document.addEventListener('click',function(e){
  var t=e.target.closest('[data-tab]');
  if(t){tab=t.dataset.tab;confirmDel=false;editName=false;render();window.scrollTo(0,0);return}
  var b=e.target.closest('[data-act]'); if(!b) return;
  var a=b.dataset.act, i=+b.dataset.i, j=+b.dataset.j;
  if(a==='mode'){mode=b.dataset.v;render()}
  else if(a==='adays'){draft.days=+b.dataset.v;render()}
  else if(a==='agoal'){draft.goal=b.dataset.v;render()}
  else if(a==='done'){
    var s=S.cur.rows[i].sets[j]; s.done=!s.done;
    $('#row-'+i+'-'+j).classList.toggle('done',s.done); b.setAttribute('aria-pressed',s.done);
    var n=S.cur.rows[i].sets.filter(function(x){return x.done}).length, tot=S.cur.rows[i].sets.length;
    $('#cnt-'+i).textContent=n+'/'+tot; $('#mt-'+i).style.width=Math.round(100*n/tot)+'%';
    if(s.done) restStart(restFor(S.cur.rows[i].id)); save();
    var tS=0,dS=0; S.cur.rows.forEach(function(r){tS+=r.sets.length;dS+=r.sets.filter(function(x){return x.done}).length});
    var pc=tS?Math.round(100*dS/tS):0; $('#hp-ring').style.setProperty('--p',pc); $('#hp-pct').textContent=pc+'%'; $('#hp-sets').textContent=dS+' / '+tS;
  }else if(a==='addset'){
    var arr=S.cur.rows[i].sets, l=arr[arr.length-1]; arr.push({kg:l.kg,reps:l.reps,done:false}); save(); render();
  }else if(a==='finish'){finish()}
  else if(a==='next'){S.summary=null;save();render();window.scrollTo(0,0)}
  else if(a==='pick'){hoyOpen=-1;S.dayIdx=i;S.cur=null;S.summary=null;save();tab='hoy';render();window.scrollTo(0,0)}
  else if(a==='days'){S.profile.days=+b.dataset.v;S.profile.custom=null;S.dayIdx=0;S.cur=null;save();render()}
  else if(a==='theme'){try{localStorage.setItem('forja-tema',b.dataset.v)}catch(x){} applyTheme(b.dataset.v); render()}
  else if(a==='fgoal'){S.profile.kcalGoal=Math.max(1000,Math.min(6000,(S.profile.kcalGoal||2200)+ +b.dataset.d));save();render()}
  else if(a==='fretry'){foodRetry(b.dataset.id)}
  else if(a==='fdel'){S.profile.meals=meals().filter(function(m){return m.id!==b.dataset.id});putPhoto(b.dataset.id,null);save();render()}
  else if(a==='fitemdel'){var fm=meals().filter(function(m){return m.id===b.dataset.id})[0]; if(fm){fm.items.splice(j,1);save();render()}}
  else if(a==='acc'){S.profile.acc=b.dataset.v;save();applyAcc();render()}
  else if(a==='tpl'){
    var tp=TPL.filter(function(x){return x.id===b.dataset.id})[0];
    if(tp){S.profile.custom=tp.days.map(function(d){return {n:d.n,e:d.e.slice()}}); S.profile.cfg=null;
      if(tp.cfg){S.profile.cfg={}; Object.keys(tp.cfg).forEach(function(k){S.profile.cfg[k]={sets:tp.cfg[k][0],reps:tp.cfg[k][1]}})}
      S.dayIdx=0;S.cur=null;editPlan=false;save();render();window.scrollTo(0,0)}
  }
  else if(a==='howto'){hoyOpen=(hoyOpen===i?-1:i);render()}
  else if(a==='kgadj'){S.cur.rows[i].sets.forEach(function(x){if(!x.done) x.kg=Math.max(0,Math.round((x.kg+ +b.dataset.d)*10)/10)}); save(); render()}
  else if(a==='pkopen'){pick={i:+b.dataset.i,q:'',g:'Todos',n:PK_N,msg:''};render();setTimeout(function(){var q=$('#pk-q'); if(q){q.focus();q.scrollIntoView({block:'center'})}},50)}
  else if(a==='pkclose'){pick=null;render()}
  else if(a==='pkg'){pick.g=b.dataset.g;pick.n=PK_N;pick.msg='';render()}
  else if(a==='pkmore'){pick.n+=PK_N;$('#pk-list').innerHTML=pkList()}
  else if(a==='pkadd'){var cx=cust(); cx[pick.i].e.push(b.dataset.id); pick.msg=EX[b.dataset.id].n; touchPlan(); save(); render()}
  else if(a==='pedit'){pick=null;editPlan=!editPlan;render();window.scrollTo(0,0)}
  else if(a==='pcfg'){setCfg(b.dataset.id,b.dataset.k,+b.dataset.d);touchPlan();save();render()}
  else if(a==='padd'){var sel=$('#add-'+i); if(sel&&sel.value){var c1=cust(); c1[i].e.push(sel.value); touchPlan(); save(); render()}}
  else if(a==='prem'){var c2=cust(); if(c2[i].e.length>1){c2[i].e.splice(j,1); touchPlan(); save(); render()}}
  else if(a==='pmove'){var c3=cust(), dd=+b.dataset.d, e3=c3[i].e; if(j+dd>=0&&j+dd<e3.length){var tmp=e3[j];e3[j]=e3[j+dd];e3[j+dd]=tmp; touchPlan(); save(); render()}}
  else if(a==='paddday'){var c4=cust(); if(c4.length<7){c4.push({n:'Día '+(c4.length+1),e:['squat']}); save(); render()}}
  else if(a==='pdelday'){var c5=cust(); if(c5.length>1){c5.splice(i,1); S.dayIdx=0; S.cur=null; save(); render()}}
  else if(a==='preset'){S.profile.custom=null;S.profile.cfg=null;S.dayIdx=0;S.cur=null;save();render()}
  else if(a==='goal'){S.profile.goal=b.dataset.v;S.cur=null;save();render()}
  else if(a==='clear-examples'){S.sessions=S.sessions.filter(function(s){return !s.example});S.cur=null;save();render()}
  else if(a==='reset'){S.sessions=[];S.dayIdx=0;S.cur=null;S.summary=null;restStop();save();render()}
  else if(a==='logout'){save();sbLogout();DB.session=null;S=null;applyAcc();restStop();mode='login';saveDB();render();window.scrollTo(0,0)}
  else if(a==='delete'){
    if(!confirmDel){confirmDel=true;render();return}
    sbDelete(); DB.del=DB.del||{}; DB.del[DB.session]=Date.now(); delete DB.users[DB.session]; DB.session=null; S=null; confirmDel=false; restStop(); mode='signup'; saveDB(); render(); window.scrollTo(0,0);
  }
  else if(a==='toggle-ex'){var xid=b.dataset.id;openEx=openEx===xid?null:xid;$('#lib-list').innerHTML=libList();var nb=document.getElementById('ex-'+xid);if(nb) nb.focus({preventScroll:true})}
  else if(a==='lib-g'){libG=b.dataset.v;render()}
  else if(a==='vis'){S.profile.routine=b.dataset.v;save();render()}
  else if(a==='rename-open'){editName=true;render();setTimeout(function(){var e=document.getElementById('f-name2');if(e){e.focus();e.select()}},30)}
  else if(a==='rename-cancel'){editName=false;render()}
  else if(a==='photo-pick'){var fi=document.getElementById('photo-in'); if(fi) fi.click()}
  else if(a==='photo-del'){delete S.profile.photo; save(); render()}
  else if(a==='rename-save'){renameSave()}
  else if(a==='restex'){var rx=S.profile.restEx=S.profile.restEx||{}; rx[b.dataset.id]=Math.max(15,Math.min(600,restFor(b.dataset.id)+ +b.dataset.d)); save(); render()}
  else if(a==='restcfg'){restSet(b.dataset.k,+b.dataset.d); save(); render()}
  else if(a==='resttog'){var rc=restCfg(), rr=S.profile.rest=S.profile.rest||{}; rr.main=rc.main; rr.acc=rc.acc; rr.beep=rc.beep; rr.vib=rc.vib; rr[b.dataset.k]=!rc[b.dataset.k]; if(b.dataset.k==='beep'&&rr.beep) ping(); save(); render()}
  else if(a==='rest-add'){if(rest){rest.end+=15000;rest.total+=15;restUpdate()}}
  else if(a==='rest-stop'){restStop()}
});
document.addEventListener('input',function(e){
  var t=e.target;
  if(t.dataset.a){draft[t.dataset.a]=t.value;return}
  if(t.dataset.lib!==undefined){libQ=t.value;var L=$('#lib-list');if(L) L.innerHTML=libList();return}
  if(!S) return;
  if(t.dataset.pq&&pick){pick.q=t.value;pick.n=PK_N;pick.msg='';$('#pk-list').innerHTML=pkList();return}
  if(t.dataset.note){S.profile.notes=S.profile.notes||{}; S.profile.notes[t.dataset.note]=t.value.slice(0,300); save(); return}
  if(t.dataset.set){
    var p=t.dataset.set.split('.'), v=parseFloat(String(t.value).replace(',','.'));
    S.cur.rows[+p[0]].sets[+p[1]][p[2]]=isNaN(v)?0:v; save();
  }else if(t.dataset.dn!==undefined){var cd=cust(),ix=+t.dataset.dn; if(cd[ix]){cd[ix].n=t.value.slice(0,30)||('Día '+(ix+1)); if(S.cur&&S.cur.dayIdx===ix) S.cur.name=cd[ix].n; save()}}
  else if(t.dataset.f==='name'){S.profile.name=t.value.slice(0,30);save()}
  else if(t.dataset.f==='bw'){var w=parseFloat(String(t.value).replace(',','.')); if(w>30&&w<250){S.profile.bw=w;S.cur=null;save()}}
});
if(!S) mode=Object.keys(DB.users).length?'login':'signup';
render();
cloudInit();
sbBoot();
})();
