<?php
namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class AirportParkingExport implements FromCollection, WithHeadings, WithStyles
{
    protected $data;
    protected $colorMap       = [];
    protected $companyColumns = [];

    public function __construct($data)
    {
        $this->data = $data;
        $this->generateColorMap();
        $this->mapCompanyColumns();
    }

    protected function generateColorMap()
    {
        $colors = [
            'FFE6B3', // Light Orange
            'C6E0B4', // Light Green
            'B4C6E7', // Light Blue
            'F8CBAD', // Peach
            'E2EFDA', // Mint
            'D9E1F2', // Pale Blue
            'FFF2CC', // Light Yellow
            'FCE4D6', // Light Pink
        ];

        $colorIndex = 0;
        foreach ($this->data as $websiteName => $companies) {
            $this->colorMap[$websiteName] = [
                'header' => $colors[$colorIndex % count($colors)],
                'data'   => $this->lightenColor($colors[$colorIndex % count($colors)]),
            ];
            $colorIndex++;
        }
    }

    protected function mapCompanyColumns()
    {
        $column = 'B'; // Start from column B (Date is column A)

        foreach ($this->data as $websiteName => $companies) {
            foreach ($companies as $companyName => $prices) {
                $this->companyColumns[$column] = $websiteName;
                $column++;
            }
        }
    }

    public function collection()
    {
        $rows = [];

        // Get all unique dates across all companies
        $dates = collect($this->data)
            ->flatMap(function ($website) {
                return collect($website)->flatMap(function ($company) {
                    return collect($company)->pluck('date');
                });
            })
            ->unique()
            ->sort()
            ->values();

        // Create data rows
        foreach ($dates as $date) {
            $row = [$date];

            foreach ($this->data as $websiteName => $companies) {
                foreach ($companies as $companyName => $prices) {
                    $priceInfo = collect($prices)->firstWhere('date', $date);
                    $row[]     = $priceInfo ? $priceInfo['price'] : '';
                }
            }

            $rows[] = $row;
        }

        return collect($rows);
    }

    public function headings(): array
    {
        $headers = ['Date'];

        foreach ($this->data as $websiteName => $companies) {
            foreach ($companies as $companyName => $prices) {
                $headers[] = $companyName;
            }
        }

        return $headers;
    }

    public function styles(Worksheet $sheet)
    {
        // Apply styles to all company columns
        foreach ($this->companyColumns as $column => $websiteName) {
            $colors = $this->colorMap[$websiteName];

            // Style header
            $sheet->getStyle($column . '1')->applyFromArray([
                'fill'    => [
                    'fillType'   => Fill::FILL_SOLID,
                    'startColor' => ['argb' => $colors['header']],
                ],
                'font'    => [
                    'bold'  => true,
                    'color' => ['argb' => 'FF000000'],
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        'color'       => ['argb' => 'FF000000'],
                    ],
                ],
            ]);

            // Style data cells
            $lastRow = $sheet->getHighestRow();
            $sheet->getStyle($column . '2:' . $column . $lastRow)->applyFromArray([
                'fill'    => [
                    'fillType'   => Fill::FILL_SOLID,
                    'startColor' => ['argb' => $colors['data']],
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        'color'       => ['argb' => 'FF000000'],
                    ],
                ],
            ]);
        }

        // Style Date column
        $lastRow = $sheet->getHighestRow();
        $sheet->getStyle('A1:A' . $lastRow)->applyFromArray([
            'fill'    => [
                'fillType'   => Fill::FILL_SOLID,
                'startColor' => ['argb' => 'FFD9D9D9'],
            ],
            'font'    => [
                'bold' => true,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    'color'       => ['argb' => 'FF000000'],
                ],
            ],
        ]);

        // Apply borders to the entire data range
        $lastColumn = $sheet->getHighestColumn();
        $sheet->getStyle('A1:' . $lastColumn . $lastRow)->applyFromArray([
            'borders' => [
                'outline' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM,
                    'color'       => ['argb' => 'FF000000'],
                ],
                'inside'  => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    'color'       => ['argb' => 'FF000000'],
                ],
            ],
        ]);

        // Set column widths
        $sheet->getColumnDimension('A')->setWidth(15);
        foreach ($this->companyColumns as $column => $websiteName) {
            $sheet->getColumnDimension($column)->setWidth(20);
        }

        // Freeze header row
        $sheet->freezePane('A2');
    }

    protected function lightenColor($color)
    {
        // Convert hex to RGB
        $r = hexdec(substr($color, 0, 2));
        $g = hexdec(substr($color, 2, 2));
        $b = hexdec(substr($color, 4, 2));

        // Lighten by 30%
        $r = min(255, $r + (255 - $r) * 0.3);
        $g = min(255, $g + (255 - $g) * 0.3);
        $b = min(255, $b + (255 - $b) * 0.3);

        // Convert back to hex
        return sprintf("%02X%02X%02X", $r, $g, $b);
    }
}
